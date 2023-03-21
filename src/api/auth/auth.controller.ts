import {
  Body,
  Controller,
  Get,
  Res,
  Post,
  UseGuards,
  HttpStatus,
  UseInterceptors,
  HttpCode,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from '@api/auth/auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PasswordLoginDto } from './dto/password-login.dto';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { CookieToBodyInterceptor } from '@common/interceptors/cookie-to-body.interceptor';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { RealIP } from 'nestjs-real-ip';
import { RefreshTokenInfo } from './dto/refresh-token-info.dto';
import { ApiResponseHelper } from '@common/helpers/api-response.helper';
import { User } from '@api/user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { ConfirmEmailVerificationCodeDto } from '../verification/dto/confirm-email-verification.dto';
import { SendPhoneNumberVerificationCodeDto } from '../verification/dto/send-phone-verification.dto';
import { ConfirmPhoneNumberVerificationCodeDto } from '../verification/dto/confirm-phone-verification.dto';
import { SendEmailVerificationCodeDto } from '../verification/dto/send-email-verification.dto';
import { VerificationService } from '../verification/verification.service';
import { ConfirmEmailVerificationCodeForAdminDto } from '../verification/dto/confirm-email-verification-for-admin.dto';
import { PasswordResetDto } from '../user/dto/password-reset.dto';
import { JwtService } from '@nestjs/jwt';
import { PincodeSetDto } from './dto/pincode-set-dto';
import { PincodeVerificationDto } from './dto/pincode-verification.dto';
import { PincodeVerificationResponseDto } from './dto/pincode-verification-response.dto';
import { PincodeResetResponseDto } from './dto/pincode-reset-response.dto';
import { PincodeSetResponseDto } from './dto/pincode-set-response.dto';
import { CreateUserResponseDto } from '../user/dto/create-user-response.dto';
import { SendEmailVerificationCodeResponseDto } from '../verification/dto/send-email-verification-code-response.dto';
import { ConfirmEmailVerificationCodeResponseDto } from '../verification/dto/confirm-email-verification-response.dto';
import { SendPhoneVerificationResponseDto } from '../verification/dto/send-phone-verification-response.dto';

@Controller()
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly verificationService: VerificationService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ description: `User login` })
  @ApiResponse(ApiResponseHelper.success(User))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed`))
  @UseGuards(LocalAuthGuard)
  @Post('user-login')
  async loginByPassword(
    @Req() req,
    @Body() body: PasswordLoginDto,
    @Res({ passthrough: true }) res: Response,
    @RealIP() ip: string,
  ) {
    const refreshTokenInfo: RefreshTokenInfo = {
      useragent: req.headers['user-agent'],
      ipaddress: ip,
    };

    const authData = await this.authService.login(req.user, refreshTokenInfo);

    res.cookie('refreshToken', authData.refreshToken, {
      httpOnly: this.configService.get('jwtConfig.refreshTokenCookieHttpOnly'),
      secure: this.configService.get('jwtConfig.refreshTokenCookieSecure'),
      maxAge: this.configService.get('jwtConfig.refreshTokenDurationDays') * 1000 * 60 * 60 * 24,
      domain: this.configService.get('jwtConfig.refreshTokenCookieDomain'),
    });

    return {
      accessToken: authData.accessToken,
      status: 'registered',
      isUserExist: true,
    };
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
  @Get('user-profile')
  async successUser(@Req() req) {
    return req.user;
  }

  @ApiOperation({ description: `Create account` })
  @Post('create-account')
  async createAccount(@Body() body: CreateUserDto): Promise<CreateUserResponseDto> {
    const createdAccount = await this.userService.createAccount(body);
    const accessToken = await this.authService.createAccessToken(createdAccount);

    await this.userService.sendEmailOtp(body.email);

    return {
      isCreated: true,
      accessToken,
    };
  }

  @ApiOperation({ description: `Send email verification code` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('send-email-verification-code')
  async sendEmailVerificationCode(
    @Req() req,
    @Body() body: SendEmailVerificationCodeDto,
  ): Promise<SendEmailVerificationCodeResponseDto> {
    console.log({ req: req.headers });
    await this.userService.sendEmailOtp(req.user.email);

    return {
      isSent: true,
      accessToken: req.headers.authorization.slice(7),
    };
  }

  @ApiOperation({ description: `Confirm email verification code` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('confirm-email-verification-code')
  async confirmEmailVerificationCode(
    @Req() req,
    @Body() body: ConfirmEmailVerificationCodeDto,
  ): Promise<ConfirmEmailVerificationCodeResponseDto> {
    const updatedUser = await this.userService.confirmEmailOtp(req.user.email, body.code);

    // const accessToken = await this.authService.createAccessToken(updatedUser);

    return {
      isConfirmed: true,
      accessToken: req.headers.authorization.slice(7),
    };
  }

  @ApiOperation({ description: `Send phone number verification code` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('send-phone-verification-code')
  async sendPhoneVerificationCode(
    @Req() req,
    @Body() body: SendPhoneNumberVerificationCodeDto,
  ): Promise<SendPhoneVerificationResponseDto> {
    const res = await this.userService.sendPhoneOtp(req.user.email, body);

    if (!res) {
      return { isSent: false };
    }

    return {
      isSent: true,
      accessToken: req.headers.authorization.slice(7),
    };
  }

  @ApiOperation({ description: `Confirm phone number verification code` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('confirm-phone-verification-code')
  async confirmPhoneNumberVerificationCode(
    @Req() req,
    @Body() body: ConfirmPhoneNumberVerificationCodeDto,
  ) {
    const updatedUser = await this.userService.confirmPhoneOtp(req.user.email, body.code);

    const accessToken = await this.authService.createAccessToken(updatedUser);

    return { accessToken };
  }

  @ApiOperation({ description: `Set PIN code` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('set-pin-code')
  async setPinCode(@Req() req, @Body() body: PincodeSetDto): Promise<PincodeSetResponseDto> {
    await this.userService.setPincode(req.user.id, body.pincode);

    return {
      isSet: true,
    };
  }

  @ApiOperation({ description: 'Verify PIN code' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('pin-code-verification')
  async verifyPinCode(
    @Req() req,
    @Body() body: PincodeVerificationDto,
  ): Promise<PincodeVerificationResponseDto> {
    const isValidated = await this.authService.validateUserByPincode(req.user.id, body.pincode);

    if (!isValidated) {
      throw new BadRequestException('Pincode is incorrect');
    }

    return {
      isConfirm: true,
      accessToken: req.headers.accessToken,
      status: 'pin_code_set',
    };
  }

  @ApiOperation({ description: 'Reset PIN code' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('reset-pin-code')
  async resetPinCode(@Req() req): Promise<PincodeResetResponseDto> {
    await this.userService.resetPincode(req.user.id);

    return {
      isReset: true,
    };
  }

  @ApiOperation({ description: `Send email verification code for forgot password` })
  @Post('send-email-verification-code-for-forgot-password')
  async sendEmailVerificationCodeForForgotPassword(
    @Body() body: SendEmailVerificationCodeDto,
  ): Promise<SendEmailVerificationCodeResponseDto> {
    const user = await this.userService.findOne({ email: body.email });

    if (user) {
      const res = await this.verificationService.sendEmailVerificationCode(body.email);

      if (!res) {
        throw new BadRequestException('Failed to send verification code');
      }

      return {
        isSent: true,
      };
    }
  }

  @ApiOperation({ description: `Confirm email verification code for forgot password` })
  @Post('confirm-email-verification-code-for-forgot-password')
  async confirmEmailForForgotPassword(@Body() body: ConfirmEmailVerificationCodeForAdminDto) {
    const updatedUser = await this.userService.confirmEmailOtpForForgotPassword(
      body.email,
      body.code,
    );

    const accessToken = await this.authService.createAccessToken(updatedUser);

    return { accessToken };
  }

  @ApiOperation({ description: `Reset password` })
  @Post('password-reset')
  async passwordReset(@Body() body: PasswordResetDto) {
    const payload: any = this.jwtService.verify(body.token);
    await this.userService.resetPassword(payload.email, body.password);

    return {
      isReset: true,
    };
  }

  @ApiOperation({ description: `User log out` })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: Request): Promise<void> {
    const { refreshToken } = req.cookies || null;

    if (!refreshToken) {
      throw new BadRequestException('Refresh token is missing');
    }

    return this.authService.logout(String(refreshToken));
  }
}
