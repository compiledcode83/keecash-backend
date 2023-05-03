import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
    private readonly userService: UserService,
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
      firstName: user.firstName,
      lastName: user.lastName,
      referralId: user.referralId,
      email: user.email,
      status: user.status,
      type: user.type,
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

  async getSumsubAccessToken(userId: string): Promise<string> {
    return this.sumsubService.createSumsubAccessToken(userId);
  }

  async sendEmailOtp(userId: number): Promise<void> {
    const user = await this.userService.findOne({ id: userId });

    if (user.emailValidated) {
      throw new BadRequestException('Email is already validated');
    }

    const res = await this.twilioService.sendEmailVerificationCode(user.email);

    if (!res) {
      throw new BadRequestException('Cannot send email OTP');
    }
  }

  async confirmEmailOtp(userId: number, code: string): Promise<boolean> {
    const { email } = await this.userService.findOne({ id: userId });

    const res = await this.twilioService.confirmEmailVerificationCode(email, code);

    if (!res) {
      throw new BadRequestException('Cannot confirm email verification code');
    }

    const updatedUser = await this.userService.update({ email }, { emailValidated: true });

    if (updatedUser.affected) return true;

    return false;
  }

  async sendEmailVerificationCodeForForgotPincode(userId: number) {
    const { email } = await this.userService.findOne({ id: userId });

    const res = await this.twilioService.sendEmailVerificationCode(email);

    if (!res) {
      throw new BadRequestException('Failed to send verification code');
    }
  }

  async sendEmailOtpForForgotPassword(email: string) {
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

    const res = await this.twilioService.sendPhoneVerificationCode(body.phoneNumber);

    if (!res) {
      throw new BadRequestException('Cannot send phone OTP');
    }

    const updatedUser = await this.userService.update(userId, { phoneNumber: body.phoneNumber });

    if (updatedUser.affected) return true;

    return false;
  }

  async confirmPhoneOtp(userId: number, code: string): Promise<boolean> {
    const user = await this.userService.findOne({ id: userId });

    const res = await this.twilioService.confirmPhoneVerificationCode(user.phoneNumber, code);

    if (!res) {
      throw new BadRequestException('Sorry, Can not confirm phone number');
    }

    const updatedUser = await this.userService.update(userId, { phoneValidated: true });

    if (updatedUser.affected) return true;

    return false;
  }

  async validateBearerToken(headers: any, type: TokenTypeEnum): Promise<any> {
    if (headers.authorization) {
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
