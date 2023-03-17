import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@api/user/user.entity';
import { UserService } from '@api/user/user.service';
import { AuthRefreshTokenService } from '@api/auth-refresh-token/auth-refresh-token.service';
import { UserAccessTokenInterface } from './auth.type';
import { AuthRefreshToken } from '@api/auth-refresh-token/auth-refresh-token.entity';
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
    private readonly authRefreshTokenService: AuthRefreshTokenService,
    private readonly verificationService: VerificationService,
  ) {}

  async login(user: User, refreshTokenInfo: RefreshTokenInfo): Promise<TokensResponseDto> {
    const oldRefreshToken = await this.authRefreshTokenService.findOneBy({
      userId: user.id,
      useragent: refreshTokenInfo.useragent,
      ipaddress: refreshTokenInfo.ipaddress,
    });

    if (oldRefreshToken) {
      await this.authRefreshTokenService.deleteByToken(oldRefreshToken.token);
    }

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user, refreshTokenInfo);

    return {
      accessToken,
      refreshToken: refreshToken.token,
    };
  }

  async validateUserByPassword(
    emailOrPhoneNumber,
    password,
  ): Promise<UserAccessTokenInterface | null> {
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
        secondName: user.secondName,
        email: user.email,
        status: user.status,
        type: user.type,
      };
    }

    return null;
  }

  async validateUserByPincode(userId, pincode): Promise<boolean> {
    const user = await this.userService.findOne({ id: userId });
    if (!user) return null;

    const isValidated = await bcrypt.compare(pincode, user.pincode);

    return isValidated;
  }

  async logout(refreshToken: string): Promise<void> {
    await this.authRefreshTokenService.deleteByToken(refreshToken);
  }

  async createAccessToken(user: User): Promise<string> {
    const payload: UserAccessTokenInterface = {
      id: user.id,
      firstName: user.firstName,
      secondName: user.secondName,
      email: user.email,
      status: user.status,
      type: user.type,
    };

    return this.jwtService.signAsync(payload);
  }

  async createRefreshToken(
    user: User,
    refreshTokenInfo: RefreshTokenInfo,
  ): Promise<AuthRefreshToken> {
    return this.authRefreshTokenService.create(user, refreshTokenInfo);
  }

  async refreshTokens(
    params: RefreshTokensDto,
    refreshTokenInfo: RefreshTokenInfo,
  ): Promise<TokensResponseDto> {
    const oldRefreshToken = await this.authRefreshTokenService.findOneBy({
      token: params.refreshToken,
    });

    if (!oldRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.authRefreshTokenService.deleteByToken(params.refreshToken);
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
