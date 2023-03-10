import {
  Body,
  Controller,
  Get,
  Res,
  Post,
  Request,
  UseGuards,
  HttpStatus,
  UseInterceptors,
  HttpCode,
  Req,
} from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CookieToBodyInterceptor } from '@src/common/interceptors/cookie-to-body.interceptor';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { RealIP } from 'nestjs-real-ip';
import { RefreshTokenInfo } from './dto/refresh-token-info.dto';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { LoginAdminDto } from './dto/login-admin.dto';
import { JwtAdminAuthGuard } from './guards/jwt-admin-auth.guard';
import { ConfirmEmailVerificationCodeForAdminDto } from '@src/user/dto/confirm-email-verification-for-admin.dto';
import { ApiResponseHelper } from '@src/common/helpers/api-response.helper';
import { User } from '@src/user/user.entity';
import { Admin } from '@src/admin/admin.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ description: `User login` })
  @ApiResponse(ApiResponseHelper.success(User))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed`))
  @UseGuards(LocalAuthGuard)
  @Post('user-login')
  async userLogin(
    @Request() request,
    @Req() req,
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
    @RealIP() ip: string,
  ) {
    const refreshTokenInfo: RefreshTokenInfo = {
      useragent: req.headers['user-agent'],
      ipaddress: ip,
    };

    const authData = await this.authService.login(request.user, refreshTokenInfo);

    res.cookie('refreshToken', authData.refreshToken, {
      httpOnly: this.configService.get('jwtConfig.refreshTokenCookieHttpOnly'),
      secure: this.configService.get('jwtConfig.refreshTokenCookieSecure'),
      maxAge: this.configService.get('jwtConfig.refreshTokenDurationDays') * 1000 * 60 * 60 * 24,
      domain: this.configService.get('jwtConfig.refreshTokenCookieDomain'),
    });

    return { accessToken: authData.accessToken };
  }

  @ApiOperation({ description: `Admin login` })
  @ApiResponse(ApiResponseHelper.success(Admin))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed`))
  @UseGuards(AdminAuthGuard)
  @Post('admin-login')
  async adminLogin(@Request() request, @Body() body: LoginAdminDto) {
    console.log('admin-login');
    return this.authService.adminLogin(body);
  }

  @ApiOperation({
    description: `Confirm OTP for email verification for admin login`,
  })
  @Post('confirm-otp')
  async confirmOtp(@Request() request, @Body() body: ConfirmEmailVerificationCodeForAdminDto) {
    const accessToken = await this.authService.confirmOtpForAdmin(body);

    return { accessToken };
  }

  @UseInterceptors(new CookieToBodyInterceptor('refreshToken', 'refreshToken'))
  @HttpCode(HttpStatus.CREATED)
  @Post('refresh-tokens')
  async refreshTokens(
    @Req() req,
    @RealIP() ip: string,
    @Body() params: RefreshTokensDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const refreshTokenInfo: RefreshTokenInfo = {
      useragent: req.headers['user-agent'],
      ipaddress: ip,
    };
    const authData = await this.authService.refreshTokens(params, refreshTokenInfo);

    res.cookie('refreshToken', authData.refreshToken, {
      httpOnly: this.configService.get('jwtConfig.refreshTokenCookieHttpOnly'),
      secure: this.configService.get('jwtConfig.refreshTokenCookieSecure'),
      maxAge: this.configService.get('jwtConfig.refreshTokenDurationDays') * 1000 * 60 * 60 * 24,
      domain: this.configService.get('jwtConfig.refreshTokenCookieDomain'),
    });

    return {
      accessToken: authData.accessToken,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/user-profile')
  async successUser(@Request() req) {
    return req.user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  @Get('/admin-profile')
  async successAdmin(@Request() req) {
    return req.user;
  }
}
