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
  UnauthorizedException,
  NotFoundException,
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
import { ApiResponseHelper } from '@common/helpers/api-response.helper';
import { User } from '@api/user/user.entity';
import { CreateUserDto } from '@api/user/dto/create-user.dto';
import { UserService } from '@api/user/user.service';
import { ConfirmEmailVerificationCodeDto } from '@api/verification/dto/confirm-email-verification.dto';
import { SendPhoneNumberVerificationCodeDto } from '@api/verification/dto/send-phone-verification.dto';
import { ConfirmPhoneNumberVerificationCodeDto } from '@api/verification/dto/confirm-phone-verification.dto';
import { VerificationService } from '@api/verification/verification.service';
import { ConfirmEmailVerificationCodeForAdminDto } from '@api/verification/dto/confirm-email-verification-for-admin.dto';
import { PasswordResetDto } from '../user/dto/password-reset.dto';
import { PincodeSetDto } from './dto/pincode-set-dto';
import { PincodeVerificationDto } from './dto/pincode-verification.dto';
import { PincodeVerificationResponseDto } from './dto/pincode-verification-response.dto';
import { PincodeResetResponseDto } from './dto/pincode-reset-response.dto';
import { PincodeSetResponseDto } from './dto/pincode-set-response.dto';
import { CipherTokenService } from '@api/cipher-token/cipher-token.service';
import { UserStatus } from '@api/user/user.types';
import { TokenTypeEnum } from '../cipher-token/cipher-token.types';
import { SendEmailVerificationCodeDto } from '../verification/dto/send-email-verification.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly verificationService: VerificationService,
    private readonly cipherTokenService: CipherTokenService,
  ) {}

  @ApiOperation({ description: `Create account` })
  @Post('create-account')
  async createAccount(@Body() body: CreateUserDto): Promise<any> {
    const user = await this.userService.create(body);

    const createAccountToken = await this.cipherTokenService.generateCreateAccountToken(user.id);

    await this.userService.sendEmailOtp(user.id);

    return {
      isCreated: true,
      token: createAccountToken,
    };
  }

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
    let token: string;

    switch (req.user.status) {
      case UserStatus.Registered:
        const { token: createAccountToken } = await this.cipherTokenService.findOneBy({
          userId: req.user.id,
          type: TokenTypeEnum.CreateAccount,
        });
        token = createAccountToken;

        break;

      case UserStatus.Completed:
        const refreshToken = await this.cipherTokenService.generateRefreshToken({
          userId: req.user.id,
          userAgent: req.headers['user-agent'],
          ipAddress: ip,
        });
        token = refreshToken;

        res.cookie('refreshToken', refreshToken, {
          httpOnly: this.configService.get('jwtConfig.refreshTokenCookieHttpOnly'),
          secure: this.configService.get('jwtConfig.refreshTokenCookieSecure'),
          maxAge:
            this.configService.get('jwtConfig.refreshTokenDurationDays') * 1000 * 60 * 60 * 24,
          domain: this.configService.get('jwtConfig.refreshTokenCookieDomain'),
        });

        break;

      default:
        break;
    }

    return {
      token,
      status: req.user.status,
      isUserExist: true,
    };
  }

  @UseInterceptors(new CookieToBodyInterceptor('refreshToken', 'refreshToken'))
  @HttpCode(HttpStatus.CREATED)
  @Post('refresh-tokens')
  async refreshTokens(
    @Req() req,
    @RealIP() ipAddress: string,
    @Body() tokenData: RefreshTokensDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const authData = await this.authService.refreshTokens(
      tokenData,
      req.headers['user-agent'],
      ipAddress,
    );

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

  @ApiOperation({ description: `Send email verification code` })
  @ApiBearerAuth()
  @Post('send-email-verification-code')
  async sendEmailVerificationCode(@Req() req) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Missing CreateAccountToken in the header');
    }

    const bearerCreateAccountToken = req.headers.authorization.split(' ')[1];

    const token = await this.cipherTokenService.findOneBy({
      token: bearerCreateAccountToken,
      type: TokenTypeEnum.CreateAccount,
    });

    if (!token) {
      throw new UnauthorizedException('CreateAccountToken is invalid');
    }

    await this.userService.sendEmailOtp(token.userId);

    return {
      isSent: true,
    };
  }

  @ApiOperation({ description: `Confirm email verification code` })
  @ApiBearerAuth()
  @Post('confirm-email-verification-code')
  async confirmEmailVerificationCode(
    @Req() req,
    @Body() body: ConfirmEmailVerificationCodeDto,
  ): Promise<any> {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Missing CreateAccountToken in the header');
    }

    const bearerCreateAccountToken = req.headers.authorization.split(' ')[1];

    const token = await this.cipherTokenService.findOneBy({
      token: bearerCreateAccountToken,
      type: TokenTypeEnum.CreateAccount,
    });

    if (!token) {
      throw new UnauthorizedException('CreateAccountToken is invalid');
    }

    const user = await this.userService.findOne({ id: token.userId });

    const res = await this.userService.confirmEmailOtp(user.email, body.code);

    if (!res) {
      throw new BadRequestException('Email verification failed');
    }

    return {
      isConfirmed: true,
    };
  }

  @ApiOperation({ description: `Send phone number verification code` })
  @ApiBearerAuth()
  @Post('send-phone-verification-code')
  async sendPhoneVerificationCode(
    @Req() req,
    @Body() body: SendPhoneNumberVerificationCodeDto,
  ): Promise<any> {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Missing CreateAccountToken in the header');
    }

    const bearerCreateAccountToken = req.headers.authorization.split(' ')[1];

    const token = await this.cipherTokenService.findOneBy({
      token: bearerCreateAccountToken,
      type: TokenTypeEnum.CreateAccount,
    });

    if (!token) {
      throw new UnauthorizedException('CreateAccountToken is invalid');
    }

    const res = await this.userService.sendPhoneOtp(token.userId, body);

    if (!res) {
      return { isSent: false };
    }

    return {
      isSent: true,
    };
  }

  @ApiOperation({ description: `Confirm phone number verification code` })
  @ApiBearerAuth()
  @Post('confirm-phone-verification-code')
  async confirmPhoneNumberVerificationCode(
    @Req() req,
    @Body() body: ConfirmPhoneNumberVerificationCodeDto,
  ) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Missing create-account token in the header');
    }

    const bearerCreateAccountToken = req.headers.authorization.split(' ')[1];

    const token = await this.cipherTokenService.findOneBy({
      token: bearerCreateAccountToken,
      type: TokenTypeEnum.CreateAccount,
    });

    if (!token) {
      throw new UnauthorizedException('CreateAccountToken is invalid');
    }

    const res = await this.userService.confirmPhoneOtp(token.userId, body.code);

    if (!res) {
      throw new BadRequestException('Phone number verification failed');
    }

    return {
      isConfirmed: true,
    };
  }

  @ApiOperation({ description: `Set PIN code` })
  @ApiBearerAuth()
  @Post('set-pin-code')
  async setPinCode(@Req() req, @Body() body: PincodeSetDto): Promise<PincodeSetResponseDto> {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Missing refresh token in the header');
    }

    const bearerRefreshToken = req.headers.authorization.split(' ')[1];

    const userId = await this.cipherTokenService.checkIfValid(
      bearerRefreshToken,
      TokenTypeEnum.AuthRefresh,
    );

    await this.userService.setPincode(userId, body.pincode);

    return {
      isSet: true,
    };
  }

  @ApiOperation({ description: 'Verify PIN code' })
  @ApiBearerAuth()
  @Post('pin-code-verification')
  async verifyPinCode(
    @Req() req,
    @Body() body: PincodeVerificationDto,
    @Res({ passthrough: true }) res: Response,
    @RealIP() ipAddress: string,
  ): Promise<PincodeVerificationResponseDto> {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Missing refresh token in the header');
    }

    const bearerRefreshToken = req.headers.authorization.split(' ')[1];

    const userId = await this.cipherTokenService.checkIfValid(
      bearerRefreshToken,
      TokenTypeEnum.AuthRefresh,
    );

    const validatedUser = await this.authService.validateUserByPincode(userId, body.pincode);

    if (!validatedUser) throw new UnauthorizedException('Pincode is incorrect');

    const { accessToken, refreshToken } = await this.authService.login(
      validatedUser,
      req.headers['user-agent'],
      ipAddress,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: this.configService.get('jwtConfig.refreshTokenCookieHttpOnly'),
      secure: this.configService.get('jwtConfig.refreshTokenCookieSecure'),
      maxAge: this.configService.get('jwtConfig.refreshTokenDurationDays') * 1000 * 60 * 60 * 24,
      domain: this.configService.get('jwtConfig.refreshTokenCookieDomain'),
    });

    return {
      isConfirm: true,
      accessToken,
      status: 'pin_code_set',
    };
  }

  @ApiOperation({ description: `Send email verification code for forgot pincode` })
  @ApiBearerAuth()
  @Post('send-email-verification-code-for-forgot-pincode')
  async sendEmailVerificationCodeForForgotPincode(@Req() req): Promise<any> {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Missing refresh token in the header');
    }

    const bearerRefreshToken = req.headers.authorization.split(' ')[1];

    const userId = await this.cipherTokenService.checkIfValid(
      bearerRefreshToken,
      TokenTypeEnum.AuthRefresh,
    );

    const { email } = await this.userService.findOne({ id: userId });

    const res = await this.verificationService.sendEmailVerificationCode(email);

    if (!res) {
      throw new BadRequestException('Failed to send verification code');
    }

    return {
      isSent: true,
    };
  }

  @ApiOperation({ description: `Confirm email verification code for forgot pincode` })
  @ApiBearerAuth()
  @Post('confirm-email-verification-code-for-forgot-pincode')
  async confirmEmailVerificationCodeForForgotPincode(
    @Req() req,
    @Body() body: ConfirmEmailVerificationCodeDto,
  ) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Missing refresh token in the header');
    }

    const bearerRefreshToken = req.headers.authorization.split(' ')[1];

    const userId = await this.cipherTokenService.checkIfValid(
      bearerRefreshToken,
      TokenTypeEnum.AuthRefresh,
    );

    const { email } = await this.userService.findOne({ id: userId });

    await this.userService.confirmEmailOtpForForgotPassword(email, body.code);

    const resetPasswordToken = await this.cipherTokenService.generateResetPincodeToken(userId);

    return { resetPasswordToken };
  }

  @ApiOperation({ description: 'Reset PIN code' })
  @ApiBearerAuth()
  @Post('reset-pin-code')
  async resetPinCode(@Req() req, @Body() body: PincodeSetDto): Promise<PincodeResetResponseDto> {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Missing reset-pincode token in the header');
    }

    const bearerResetPincodeToken = req.headers.authorization.split(' ')[1];

    const userId = await this.cipherTokenService.checkIfValid(
      bearerResetPincodeToken,
      TokenTypeEnum.ResetPincode,
    );

    await this.userService.setPincode(userId, body.pincode);

    await this.cipherTokenService.deleteByToken(bearerResetPincodeToken);

    return {
      isReset: true,
    };
  }

  @ApiOperation({ description: `Send email verification code for forgot password` })
  @HttpCode(HttpStatus.OK)
  @Post('send-email-verification-code-for-forgot-password')
  async sendEmailVerificationCodeForForgotPassword(
    @Body() body: SendEmailVerificationCodeDto,
  ): Promise<any> {
    const user = await this.userService.findOne({ email: body.email });

    if (!user) {
      throw new NotFoundException('User not found with this email');
    }

    const res = await this.verificationService.sendEmailVerificationCode(body.email);

    if (!res) {
      throw new BadRequestException('Failed to send verification code');
    }

    return {
      isSent: true,
    };
  }

  @ApiOperation({ description: `Confirm email verification code for forgot password` })
  @Post('confirm-email-verification-code-for-forgot-password')
  async confirmEmailForForgotPassword(@Body() body: ConfirmEmailVerificationCodeForAdminDto) {
    await this.userService.confirmEmailOtpForForgotPassword(body.email, body.code);

    const { id } = await this.userService.findOne({ email: body.email });

    const resetPasswordToken = await this.cipherTokenService.generateResetPasswordToken(id);

    return { resetPasswordToken };
  }

  @ApiOperation({ description: `Reset password` })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('password-reset')
  async passwordReset(@Req() req, @Body() body: PasswordResetDto) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Missing reset-password token in the header');
    }

    const bearerResetPasswordToken = req.headers.authorization.split(' ')[1];

    const userId = await this.cipherTokenService.checkIfValid(
      bearerResetPasswordToken,
      TokenTypeEnum.AuthRefresh,
    );

    await this.cipherTokenService.deleteByToken(bearerResetPasswordToken);

    await this.userService.resetPassword(userId, body.password);

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
