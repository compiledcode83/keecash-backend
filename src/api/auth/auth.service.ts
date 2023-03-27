import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@api/user/user.entity';
import { UserService } from '@api/user/user.service';
import { CipherTokenService } from '@src/api/cipher-token/cipher-token.service';
import { UserAccessTokenInterface } from './auth.type';
import { CipherToken } from '@src/api/cipher-token/cipher-token.entity';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { RefreshTokenInfo } from './dto/refresh-token-info.dto';
import { VerificationService } from '@api/verification/verification.service';
import { isEmail } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly cipherTokenService: CipherTokenService,
    private readonly verificationService: VerificationService,
  ) {}

  async login(user: Partial<User>, refreshTokenInfo: RefreshTokenInfo): Promise<TokensResponseDto> {
    const oldRefreshToken = await this.cipherTokenService.findOneBy({
      userId: user.id,
      userAgent: refreshTokenInfo.userAgent,
      ipAddress: refreshTokenInfo.ipAddress,
    });

    if (oldRefreshToken) {
      await this.cipherTokenService.deleteByToken(oldRefreshToken.token);
    }

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user, refreshTokenInfo);

    return {
      accessToken,
      refreshToken: refreshToken.token,
    };
  }

  async validateUserByPassword(emailOrPhoneNumber, password): Promise<UserAccessTokenInterface> {
    let user: User;

    if (isEmail(emailOrPhoneNumber)) {
      user = await this.userService.findOne({ email: emailOrPhoneNumber });
    } else {
      user = await this.userService.findOne({ phoneNumber: emailOrPhoneNumber });
    }
    if (!user) return null;

    const isValidated = await bcrypt.compare(password, user.password);

    if (isValidated) {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        referralId: user.referralId,
        email: user.email,
        status: user.status,
        type: user.type,
      };
    }

    return null;
  }

  async validateUserByPincode(userId, pincode): Promise<Partial<User>> {
    const user = await this.userService.findOne({ id: userId });
    if (!user || !user.pincodeSet) {
      return null;
    }

    const isValidated = await bcrypt.compare(pincode, user.pincode);

    if (isValidated) {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        referralId: user.referralId,
        email: user.email,
        status: user.status,
        type: user.type,
      };
    }

    return null;
  }

  async logout(refreshToken: string): Promise<void> {
    await this.cipherTokenService.deleteByToken(refreshToken);
  }

  async createAccessToken(user: Partial<User>): Promise<string> {
    const payload: UserAccessTokenInterface = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      referralId: user.referralId,
      email: user.email,
      status: user.status,
      type: user.type,
    };

    return this.jwtService.signAsync(payload);
  }

  async createRefreshToken(
    user: Partial<User>,
    refreshTokenInfo: RefreshTokenInfo,
  ): Promise<CipherToken> {
    return this.cipherTokenService.createRefreshToken(user, refreshTokenInfo);
  }

  async createResetPasswordToken(userId: number) {
    return this.cipherTokenService.createResetPasswordToken(userId);
  }

  async refreshTokens(
    params: RefreshTokensDto,
    refreshTokenInfo: RefreshTokenInfo,
  ): Promise<TokensResponseDto> {
    const oldRefreshToken = await this.cipherTokenService.findOneBy({
      token: params.refreshToken,
    });

    if (!oldRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.cipherTokenService.deleteByToken(params.refreshToken);
    const user = await this.userService.findOne({ id: oldRefreshToken.userId });

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user, refreshTokenInfo);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken.token,
    };
  }

  async getSumsubAccessToken(userId: string): Promise<string> {
    return this.verificationService.createSumsubAccessToken(userId);
  }
}
