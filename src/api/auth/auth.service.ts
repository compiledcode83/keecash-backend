import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@api/user/user.entity';
import { UserService } from '@api/user/user.service';
import { AuthRefreshTokenService } from '@src/api/auth-refresh-token/auth-refresh-token.service';
import { UserAccessTokenInterface } from './auth.type';
import { AuthRefreshToken } from '@src/api/auth-refresh-token/auth-refresh-token.entity';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { RefreshTokenInfo } from './dto/refresh-token-info.dto';
import { VerificationService } from '@api/verification/verification.service';

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

  async validateUser(
    emailOrPhoneNumber: string,
    password: string,
  ): Promise<UserAccessTokenInterface | null> {
    const userByEmail = await this.userService.findByEmail(emailOrPhoneNumber);

    if (userByEmail && (await bcrypt.compare(password, userByEmail.password))) {
      return {
        id: userByEmail.id,
        firstName: userByEmail.firstName,
        secondName: userByEmail.secondName,
        email: userByEmail.email,
        status: userByEmail.status,
        type: userByEmail.type,
      };
    }

    const userByPhonenumber = await this.userService.findByPhonenumber(emailOrPhoneNumber);

    if (userByPhonenumber && (await bcrypt.compare(password, userByPhonenumber.password))) {
      return {
        id: userByPhonenumber.id,
        firstName: userByPhonenumber.firstName,
        secondName: userByPhonenumber.secondName,
        email: userByPhonenumber.email,
        status: userByPhonenumber.status,
        type: userByPhonenumber.type,
      };
    }

    return null;
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
    const user = await this.userService.findOne(oldRefreshToken.userId);

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
