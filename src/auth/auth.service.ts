import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@src/user/table/user.entity';
import { UserService } from '@src/user/user.service';
import { AuthRefreshTokenService } from '@src/auth-refresh-token/auth-refresh-token.service';
import { AccessTokenInterface } from './auth.type';
import { AuthRefreshToken } from '@src/auth-refresh-token/auth-refresh-token.entity';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { RefreshTokenInfo } from './dto/refresh-token-info.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
  ) {}

  async login(
    user: User,
    refreshTokenInfo: RefreshTokenInfo,
  ): Promise<TokensResponseDto> {
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
  ): Promise<Partial<User> | null> {
    const userByEmail = await this.userService.findByEmail(emailOrPhoneNumber);

    if (userByEmail && (await bcrypt.compare(password, userByEmail.password))) {
      return {
        id: userByEmail.id,
        name: userByEmail.name,
        email: userByEmail.email,
        phoneNumber: userByEmail.phoneNumber,
        accountType: userByEmail.accountType,
      };
    }

    const userByPhoneNumber = await this.userService.findByPhoneNumber(
      emailOrPhoneNumber,
    );

    if (
      userByPhoneNumber &&
      (await bcrypt.compare(password, userByPhoneNumber.password))
    ) {
      return {
        id: userByPhoneNumber.id,
        name: userByPhoneNumber.name,
        email: userByPhoneNumber.email,
        phoneNumber: userByPhoneNumber.phoneNumber,
        accountType: userByPhoneNumber.accountType,
      };
    }

    return null;
  }

  async logout(refreshToken: string): Promise<void> {
    await this.authRefreshTokenService.deleteByToken(refreshToken);
  }

  private async createAccessToken(user: User): Promise<string> {
    const payload: AccessTokenInterface = {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      accountType: user.accountType,
    };

    return this.jwtService.signAsync(payload);
  }

  private async createRefreshToken(
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
}
