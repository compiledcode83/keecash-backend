import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@src/user/user.entity';
import { UserService } from '@src/user/user.service';
import { AuthRefreshTokenService } from '@src/auth-refresh-token/auth-refresh-token.service';
import { AccessTokenInterface } from './auth.type';
import { AuthRefreshToken } from '@src/auth-refresh-token/auth-refresh-token.entity';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
  ) {}

  async login(user: User): Promise<TokensResponseDto> {
    const oldRefreshToken = await this.authRefreshTokenService.findOneBy({
      userId: user.id,
    });

    if (oldRefreshToken) {
      await this.authRefreshTokenService.deleteByToken(oldRefreshToken.token);
    }

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    return {
      accessToken,
      refreshToken: refreshToken.token,
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return { name: user.name, email: user.email, id: user.id };
    }

    return null;
  }

  async logout(refreshToken: string): Promise<void> {
    await this.authRefreshTokenService.deleteByToken(refreshToken);
  }

  private async createAccessToken(user: User): Promise<string> {
    const payload: AccessTokenInterface = {
      name: user.name,
      email: user.email,
      id: user.id,
    };

    return this.jwtService.signAsync(payload);
  }

  private async createRefreshToken(user: User): Promise<AuthRefreshToken> {
    return this.authRefreshTokenService.create(user);
  }

  async refreshTokens(params: RefreshTokensDto): Promise<TokensResponseDto> {
    const oldRefreshToken = await this.authRefreshTokenService.findOneBy({
      token: params.refreshToken,
    });

    if (!oldRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.authRefreshTokenService.deleteByToken(params.refreshToken);
    const user = await this.userService.findOne(oldRefreshToken.userId);

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken.token,
    };
  }
}
