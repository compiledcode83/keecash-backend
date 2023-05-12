import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@api/user/user.service';
import { CipherTokenService } from '@api/cipher-token/cipher-token.service';
import { UserAccessTokenInterface } from './auth.type';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { SumsubService } from '@api/sumsub/sumsub.service';
import { UserStatus } from '@api/user/user.types';
import { TokenTypeEnum } from '@api/cipher-token/cipher-token.types';
import { TwilioService } from '@api/twilio/twilio.service';
import { SendPhoneNumberVerificationCodeDto } from '@api/twilio/dto/send-phone-verification.dto';
import { CountryService } from '@api/country/country.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly cipherTokenService: CipherTokenService,
    private readonly sumsubService: SumsubService,
    private readonly twilioService: TwilioService,
    private readonly countryService: CountryService,
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

  async validateUserByPassword(emailOrPhoneNumber, password): Promise<UserAccessTokenInterface> {
    const user = await this.userService.findOne([
      { email: emailOrPhoneNumber },
      { phoneNumber: emailOrPhoneNumber },
    ]);

    if (!user) return null;

    const isValidated = await bcrypt.compare(password, user.password);

    if (isValidated) {
      let countryId;

      if (user.status === UserStatus.Completed) {
        const { personProfile } = await this.userService.findOneWithProfileAndDocuments(
          { id: user.id },
          true,
          false,
        );

        countryId = personProfile.countryId;
      }

      return {
        id: user.id,
        uuid: user.uuid,
        firstName: user.firstName,
        lastName: user.lastName,
        referralId: user.referralId,
        email: user.email,
        status: user.status,
        type: user.type,
        pincodeSet: user.pincodeSet,
        countryId,
      };
    }

    return null;
  }

  async validateUserByPincode(userId, pincode): Promise<any> {
    const user = await this.userService.findOne({ id: userId });
    if (!user || !user.pincodeSet) {
      return null;
    }

    const isValidated = await bcrypt.compare(pincode, user.pincode);

    if (isValidated) {
      const {
        personProfile: { countryId },
      } = await this.userService.findOneWithProfileAndDocuments({ id: user.id }, true, false);

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
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
      id: user.id,
      uuid: user.uuid,
      firstName: user.firstName,
      lastName: user.lastName,
      referralId: user.referralId,
      email: user.email,
      status: user.status,
      type: user.type,
      pincodeSet: user.pincodeSet,
      countryId: user.countryId,
    };

    return this.jwtService.signAsync(payload);
  }

  async getUserPayload(accessToken: string): Promise<UserAccessTokenInterface> {
    return this.jwtService.decode(accessToken) as UserAccessTokenInterface;
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

  async sendEmailOtp(userId: number): Promise<boolean> {
    const user = await this.userService.findOne({ id: userId });

    if (user.emailValidated) {
      throw new BadRequestException('Email is already validated');
    }

    const res = await this.twilioService.sendEmailVerificationCode(user.email, user.language);

    return res;
  }

  async confirmEmailOtp(userId: number, code: string): Promise<boolean> {
    const { email } = await this.userService.findOne({ id: userId });

    const res = await this.twilioService.confirmEmailVerificationCode(email, code);

    if (!res) {
      return false;
    }

    const updatedUser = await this.userService.update({ email }, { emailValidated: true });

    if (updatedUser.affected) return true;

    return false;
  }

  async sendEmailVerificationCodeForForgotPincode(userId: number) {
    const { email, language } = await this.userService.findOne({ id: userId });

    const res = await this.twilioService.sendEmailVerificationCode(email, language);

    if (!res) {
      throw new BadRequestException('Failed to send verification code');
    }
  }

  async sendEmailOtpForForgotPassword(email: string) {
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found with this email');
    }

    const res = await this.twilioService.sendEmailVerificationCode(email, user.language);

    return res;
  }

  async confirmEmailOtpForForgotPassword(userId: number, code: string): Promise<boolean> {
    const { email } = await this.userService.findOne({ id: userId });

    const res = await this.twilioService.confirmEmailVerificationCode(email, code);

    return res;
  }

  async sendPhoneOtp(userId: number, body: SendPhoneNumberVerificationCodeDto): Promise<boolean> {
    const user = await this.userService.findOne({ id: userId });

    if (!user.emailValidated) {
      throw new BadRequestException('Email is not validated yet');
    }

    if (user.phoneValidated) {
      throw new BadRequestException('Phone number is already validated');
    }

    const country = await this.countryService.findOne({ name: body.country });

    if (!body.phoneNumber.startsWith(country.phoneCode)) {
      throw new BadRequestException('Phone number format is incorrect');
    }

    const res = await this.twilioService.sendPhoneVerificationCode(body.phoneNumber, user.language);

    if (!res) {
      return res;
    }

    const updatedUser = await this.userService.update(userId, { phoneNumber: body.phoneNumber });

    if (updatedUser.affected) return true;

    return false;
  }

  async confirmPhoneOtp(userId: number, code: string): Promise<boolean> {
    const user = await this.userService.findOne({ id: userId });

    const res = await this.twilioService.confirmPhoneVerificationCode(user.phoneNumber, code);

    if (!res) {
      return res;
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

  async validateTokenForSetPincode(headers: any): Promise<number> {
    //user can set pin code when cipher.type = TokenTypeEnum.AuthRefresh (account validated) or when cipher.type = TokenTypeEnum.CreateAccount

    let userId = 0;
    try {
      userId = await this.validateBearerToken(headers, TokenTypeEnum.AuthRefresh);
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        //we try case TokenTypeEnum.CreateAccount
        const token = await this.validateBearerToken(headers, TokenTypeEnum.CreateAccount);

        userId = token.userId;
      } else {
        throw e;
      }
    }

    if (!userId) {
      throw new UnauthorizedException('Token is invalid');
    }

    return userId;
  }
}
