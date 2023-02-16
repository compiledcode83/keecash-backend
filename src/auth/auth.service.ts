import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@src/user/table/user.entity';
import { UserService } from '@src/user/user.service';
import { AuthRefreshTokenService } from '@src/auth-refresh-token/auth-refresh-token.service';
import { AccessTokenInterfaceForUser, AccessTokenInterfaceForAdmin } from './auth.type';
import { AuthRefreshToken } from '@src/auth-refresh-token/auth-refresh-token.entity';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { RefreshTokenInfo } from './dto/refresh-token-info.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ConfirmEmailVerificationCodeDto } from '@src/user/dto/confirm-email-verification.dto';
import { VerificationService } from '@src/verification/verification.service';
import { Admin } from '@src/admin/table/admin.entity';
import { AdminService } from '@src/admin/admin.service';
import { ConfirmEmailVerificationCodeForAdminDto } from '@src/user/dto/confirm-email-verification-for-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
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

    const accessToken = await this.createAccessTokenForUser(user);
    const refreshToken = await this.createRefreshToken(user, refreshTokenInfo);

    return {
      accessToken,
      refreshToken: refreshToken.token,
    };
  }

  async validateUser(
    emailOrPhoneNumber: string,
    password: string,
  ): Promise<AccessTokenInterfaceForUser | null> {
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

  async createAccessTokenForUser(user: User): Promise<string> {
    const payload: AccessTokenInterfaceForUser = {
      id: user.id,
      firstName: user.firstName,
      secondName: user.secondName,
      email: user.email,
      status: user.status,
      type: user.type,
    };

    return this.jwtService.signAsync(payload);
  }

  async createAccessTokenForAdmin(admin: Admin): Promise<string> {
    const payload: AccessTokenInterfaceForAdmin = {
      id: admin.id,
      email: admin.email,
      type: admin.type,
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

    const accessToken = await this.createAccessTokenForUser(user);
    const refreshToken = await this.createRefreshToken(user, refreshTokenInfo);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken.token,
    };
  }

  async adminLogin(body: LoginAdminDto): Promise<string> {
    const res = await this.verificationService.sendEmailVerificationCode(body.email);
    if (res) return 'Security OTP sent your email successfully';
    throw new BadRequestException('Can not send Security OTP');
  }

  async confirmOtpForAdmin(body: ConfirmEmailVerificationCodeForAdminDto): Promise<string> {
    const res = await this.verificationService.confirmEmailVerificationCode(body.email, body.code);
    if (res) {
      const admin = await this.adminService.findAdminByEmail(body.email);
      const accessToken = await this.createAccessTokenForAdmin(admin);
      return accessToken;
    }
    throw new BadRequestException('Invalid code');
  }

  async getSumsubAccessToken(userId: string): Promise<string> {
    return this.verificationService.createSumsubAccessToken(userId);
  }
}
