import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TwilioService } from '@app/twilio';
import { CipherTokenService, TokenTypeEnum } from '@app/cipher-token';
import { SumsubService } from '@app/sumsub';
import { User } from '@app/user';
import { UserService } from '@api/user/user.service';
import { UserAccessTokenInterface } from './auth.type';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { SendPhoneVerificationCodeDto } from './dto/send-phone-verification.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly cipherTokenService: CipherTokenService,
    private readonly sumsubService: SumsubService,
    private readonly twilioService: TwilioService,
  ) {}

  async login(user: any, userAgent: string, ipAddress: string): Promise<TokensResponseDto> {
    const oldRefreshToken = await this.cipherTokenService.findOneBy({
      userId: user.id,
      userAgent,
      ipAddress,
    });

    if (oldRefreshToken) {
      await this.cipherTokenService.deleteByToken(oldRefreshToken.token);
    }

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.cipherTokenService.generateRefreshToken({
      userId: user.id,
      userAgent,
      ipAddress,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUserByPassword(emailOrPhoneNumber, password): Promise<User> {
    const user = await this.userService.findOne([
      { email: emailOrPhoneNumber },
      { phoneNumber: emailOrPhoneNumber },
    ]);
    if (!user) return null;

    const isValidated = await bcrypt.compare(password, user.password);
    if (!isValidated) return null;

    return user;
  }

  async validateUserByPincode(userId, pincode): Promise<any> {
    const user = await this.userService.findOne({ id: userId });
    if (!user || !user.pincodeSet) {
      return null;
    }

    const isValidated = await bcrypt.compare(pincode, user.pincode);

    if (isValidated) {
      const { countryId } = await this.userService.findOne({ id: user.id });

      return {
        id: user.id,
        referralId: user.referralId,
        email: user.email,
        status: user.status,
        type: user.type,
        countryId,
      };
    }

    return null;
  }

  async logout(refreshToken: string): Promise<void> {
    await this.cipherTokenService.deleteByToken(refreshToken);
  }

  async createAccessToken(user: any): Promise<string> {
    const payload: UserAccessTokenInterface = {
      uuid: user.uuid,
      referralId: user.referralId,
      email: user.email,
      status: user.status,
      type: user.type,
      pincodeSet: user.pincodeSet,
      countryId: user.countryId,
    };

    return this.jwtService.signAsync(payload);
  }

  async refreshTokens(
    tokenData: RefreshTokensDto,
    userAgent: string,
    ipAddress: string,
  ): Promise<TokensResponseDto> {
    const oldRefreshToken = await this.cipherTokenService.findOneBy({
      token: tokenData.refreshToken,
    });

    if (!oldRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.cipherTokenService.deleteByToken(tokenData.refreshToken);
    const user = await this.userService.findOne({ id: oldRefreshToken.userId });

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.cipherTokenService.generateRefreshToken({
      userId: user.id,
      userAgent,
      ipAddress,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  // --------------- OTP Verification -------------------

  async sendEmailVerificationCode(userId: number): Promise<void> {
    const user = await this.userService.findOne({ id: userId });

    if (user.emailValidated) {
      throw new BadRequestException('Email is already validated');
    }

    try {
      await this.twilioService.sendEmailVerificationCode(user.email);
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException('Error occured while sending email verification code');
    }
  }

  async confirmEmailVerificationCode(userId: number, code: string): Promise<void> {
    const { email } = await this.userService.findOne({ id: userId });

    try {
      await this.twilioService.confirmEmailVerificationCode(email, code);

      const updatedUser = await this.userService.update(userId, { emailValidated: true });

      if (!updatedUser.affected)
        throw new Error('Failed to update email verification status in database');
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException('Failed to confirm email verification code');
    }
  }

  async sendEmailVerificationCodeForForgotPincode(userId: number) {
    const { email } = await this.userService.findOne({ id: userId });

    try {
      await this.twilioService.sendEmailVerificationCode(email);
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException('Failed to confirm email verification code');
    }
  }

  async sendEmailVerificationCodeForForgotPassword(email: string) {
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found with this email');
    }

    const res = await this.twilioService.sendEmailVerificationCode(email);

    if (!res) {
      throw new BadRequestException('Failed to send verification code');
    }
  }

  async confirmEmailOtpForForgotPassword(userId: number, code: string): Promise<void> {
    const { email } = await this.userService.findOne({ id: userId });

    const res = await this.twilioService.confirmEmailVerificationCode(email, code);

    if (!res) {
      throw new BadRequestException('Cannot confirm email verification code');
    }
  }

  async sendPhoneVerificationCode(
    userId: number,
    body: SendPhoneVerificationCodeDto,
  ): Promise<void> {
    const user = await this.userService.findOne({ id: userId });

    if (!user.emailValidated) {
      throw new BadRequestException('Email is not validated yet');
    }

    if (user.phoneValidated) {
      throw new BadRequestException('Phone number is already validated');
    }

    // const country = await this.countryService.findOne({ name: body.country });
    // if (!body.phoneNumber.startsWith(country.phoneCode)) {
    //   throw new BadRequestException('Phone number format is incorrect');
    // }

    try {
      await this.twilioService.sendPhoneVerificationCode(body.phoneNumber);
    } catch (err) {
      throw new BadRequestException('Failed to send phone verification code');
    }

    await this.userService.update(userId, { phoneNumber: body.phoneNumber });
  }

  async confirmPhoneVerificationCode(userId: number, code: string): Promise<boolean> {
    const user = await this.userService.findOne({ id: userId });

    const res = await this.twilioService.confirmPhoneVerificationCode(user.phoneNumber, code);

    if (!res) {
      throw new BadRequestException('Sorry, Can not confirm phone number');
    }

    const updatedUser = await this.userService.update(userId, { phoneValidated: true });

    if (updatedUser.affected) return true;

    return false;
  }

  // ---------------- Sumsub Access Token -----------------

  async getSumsubAccessToken(userId: number): Promise<string> {
    const { uuid } = await this.userService.findOne({ id: userId });

    const savedToken = await this.cipherTokenService.findValidSumsubAccessToken(userId);

    if (savedToken) {
      return savedToken.token;
    }

    const newToken = await this.sumsubService.createSumsubAccessToken(uuid);

    await this.cipherTokenService.generateSumsubAccessToken(
      userId,
      newToken.token,
      newToken.duration,
    );

    return newToken.token;
  }

  // ------------------- Token Validator --------------------

  async validateBearerToken(headers: any, type: TokenTypeEnum): Promise<any> {
    if (!headers.authorization) {
      throw new UnauthorizedException('Missing bearer token in the header');
    }

    const bearerToken = headers.authorization.split(' ')[1];

    switch (type) {
      case TokenTypeEnum.CreateAccount:
        const token = await this.cipherTokenService.findOneBy({
          token: bearerToken,
          type,
        });

        if (!token) {
          throw new UnauthorizedException('Token is invalid');
        }

        return token;

      case TokenTypeEnum.AuthRefresh:
        const userId = await this.cipherTokenService.checkIfValid(bearerToken, type);

        return userId;

      default:
        break;
    }
  }
}
