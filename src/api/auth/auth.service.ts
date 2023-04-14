import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@api/user/user.entity';
import { UserService } from '@api/user/user.service';
import { CipherTokenService } from '@src/api/cipher-token/cipher-token.service';
import { UserAccessTokenInterface } from './auth.type';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { VerificationService } from '@api/verification/verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly cipherTokenService: CipherTokenService,
    private readonly verificationService: VerificationService,
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
      const {
        personProfile: { countryId },
      } = await this.userService.findOneWithProfileAndDocumments(user.id, true, false);

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
      } = await this.userService.findOneWithProfileAndDocumments(user.id, true, false);

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
    return this.verificationService.createSumsubAccessToken(userId);
  }
}
