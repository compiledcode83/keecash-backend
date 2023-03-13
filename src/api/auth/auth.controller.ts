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
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from '@api/auth/auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CookieToBodyInterceptor } from '@common/interceptors/cookie-to-body.interceptor';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { RealIP } from 'nestjs-real-ip';
import { RefreshTokenInfo } from './dto/refresh-token-info.dto';
import { ApiResponseHelper } from '@common/helpers/api-response.helper';
import { User } from '@api/user/user.entity';
import { CreateAccountDto } from '../user/dto/create-account.dto';
import { UserService } from '../user/user.service';
import { ConfirmEmailVerificationCodeDto } from '../user/dto/confirm-email-verification.dto';
import { SendPhoneNumberVerificationCodeDto } from '../user/dto/send-phone-verification.dto';
import { ConfirmPhoneNumberVerificationCodeDto } from '../user/dto/confirm-phone-verification.dto';
import { SendEmailVerificationCodeDto } from '../user/dto/send-email-verification.dto';
import { VerificationService } from '../verification/verification.service';
import { ConfirmEmailVerificationCodeForAdminDto } from '../user/dto/confirm-email-verification-for-admin.dto';
import { PasswordResetDto } from '../user/dto/password-reset.dto';
import { JwtService } from '@nestjs/jwt';
import { SetPincodeDto } from './dto/set-pincode-dto';

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
  async login(
    @Request() request,
    @Req() req,
    // @Body() body: LoginUserDto,
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
  async successUser(@Request() req) {
    return req.user;
  }

  @ApiOperation({ description: `Create account` })
  @Post('create-account')
  async createAccount(@Body() body: CreateAccountDto) {
    const createdAccount = await this.userService.createAccount(body);
    const accessToken = await this.authService.createAccessToken(createdAccount);

    await this.userService.sendEmailOtp(body.email);

    return accessToken;
  }

  @ApiOperation({ description: `Send email verification code` })
  @UseGuards(JwtAuthGuard)
  @Post('send-email-verification-code')
  async sendEmailVerificationCode(@Request() req) {
    return this.userService.sendEmailOtp(req.user.email);
  }

  @ApiOperation({ description: `Confirm email verification code` })
  @UseGuards(JwtAuthGuard)
  @Post('confirm-email-verification-code')
  async confirmEmailVerificationCode(
    @Request() req,
    @Body() body: ConfirmEmailVerificationCodeDto,
  ) {
    const updatedUser = await this.userService.confirmEmailOtp(req.user.email, body.code);

    const accessToken = await this.authService.createAccessToken(updatedUser);

    return { accessToken };
  }

  @ApiOperation({ description: `Send phone number verification code` })
  @UseGuards(JwtAuthGuard)
  @Post('send-phone-verification-code')
  async sendPhoneVerificationCode(
    @Request() req,
    @Body() body: SendPhoneNumberVerificationCodeDto,
  ) {
    return this.userService.sendPhoneOtp(req.user.email, body);
  }

  @ApiOperation({ description: `Confirm phone number verification code` })
  @Post('confirm-phone-verification-code')
  @UseGuards(JwtAuthGuard)
  async confirmPhoneNumberVerificationCode(
    @Request() req,
    @Body() body: ConfirmPhoneNumberVerificationCodeDto,
  ) {
    const updatedUser = await this.userService.confirmPhoneOtp(req.user.email, body.code);

    const accessToken = await this.authService.createAccessToken(updatedUser);

    return { accessToken };
  }

  @ApiOperation({ description: `Set PIN code` })
  @Post('set-pin-code')
  @UseGuards(JwtAuthGuard)
  async setPinCode(@Request() req, @Body() body: SetPincodeDto) {
    await this.userService.setPincode(req.user.id, body.pincode);
  }

  @ApiOperation({ description: 'Verify PIN code' })
  @Post('pin-code-verification')
  @UseGuards(JwtAuthGuard)
  async verifyPinCode() {
    return true;
  }

  @ApiOperation({ description: 'Reset PIN code' })
  @Post('reset-pin-code')
  @UseGuards(JwtAuthGuard)
  async resetPinCode() {
    return true;
  }

  @ApiOperation({ description: `Send email verification code for forget password` })
  @Post('send-email-verification-code-for-forget-password')
  async sendEmailVerificationCodeForForgetPassword(@Body() body: SendEmailVerificationCodeDto) {
    const user = await this.userService.findByEmail(body.email);
    if (!user) throw new BadRequestException('Sorry, Can not find user');

    const res = await this.verificationService.sendEmailVerificationCode(body.email);
    if (res) return 'Email verification code was successfully sent';

    throw new BadRequestException('Sorry, Can not send verification code');
  }

  @ApiOperation({ description: `Confirm email verification code` })
  @Post('confirm-email-verification-code-for-forget-password')
  async confirmEmailForForgetPassword(@Body() body: ConfirmEmailVerificationCodeForAdminDto) {
    const updatedUser = await this.userService.confirmEmailOtp(body.email, body.code);

    const accessToken = await this.authService.createAccessToken(updatedUser);

    return { accessToken };
  }

  @ApiOperation({ description: `Reset password` })
  @Post('password-reset')
  async passwordReset(@Body() body: PasswordResetDto) {
    const payload: any = this.jwtService.verify(body.token);
    await this.userService.passwordReset(payload.email, body.password);

    return 'Successfully changed';
  }
}
