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
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RealIP } from 'nestjs-real-ip';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CookieToBodyInterceptor, ApiResponseHelper } from '@app/common';
import { CipherTokenService, TokenTypeEnum } from '@app/cipher-token';
import { User, UserStatus } from '@app/user';
import { UserService } from '@api/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { ConfirmEmailVerificationCodeDto } from './dto/confirm-email-verification.dto';
import { SendPhoneVerificationCodeDto } from './dto/send-phone-verification.dto';
import { ConfirmPhoneNumberVerificationCodeDto } from './dto/confirm-phone-verification.dto';
import { ConfirmEmailVerificationCodeForAdminDto } from './dto/confirm-email-verification-for-admin.dto';
import { SendEmailVerificationCodeDto } from './dto/send-email-verification.dto';
import { PincodeVerificationDto } from './dto/pincode-verification.dto';
import { PasswordLoginDto } from './dto/password-login.dto';
import { PincodeResetResponseDto } from './dto/pincode-reset-response.dto';
import { PincodeSetResponseDto } from './dto/pincode-set-response.dto';
import { PincodeSetDto } from './dto/pincode-set-dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly cipherTokenService: CipherTokenService,
  ) {}

  @ApiOperation({ description: `Create account` })
  @Post('create-account')
  async createAccount(@Req() req, @Body() body: CreateUserDto, @RealIP() ip: string): Promise<any> {
    const user = await this.userService.create(body);

    const createAccountToken = await this.cipherTokenService.generateCreateAccountToken({
      userId: user.id,
      ipAddress: ip,
      userAgent: req.headers['user-agent'],
    });

    return {
      isCreated: true,
      token: createAccountToken,
    };
  }

  @ApiOperation({ description: `User login` })
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
    let registerStatus: Partial<User>;

    switch (req.user.status) {
      case UserStatus.Registered:
        const { token: createAccountToken } = await this.cipherTokenService.findOneBy({
          userId: req.user.id,
          type: TokenTypeEnum.CreateAccount,
        });
        token = createAccountToken;

        const { emailValidated, phoneValidated, kycStatus } = await this.userService.findOne({
          id: req.user.id,
        });

        registerStatus = {
          emailValidated,
          phoneValidated,
          kycStatus,
        };

        break;

      case UserStatus.Completed:
        const oldRefreshToken = await this.cipherTokenService.findOneBy({
          userId: req.user.id,
          userAgent: req.headers['user-agent'],
          ipAddress: ip,
        });
        if (oldRefreshToken) {
          await this.cipherTokenService.deleteByToken(oldRefreshToken.token);
        }

        const refreshToken = await this.cipherTokenService.generateRefreshToken({
          userId: req.user.id,
          userAgent: req.headers['user-agent'],
          ipAddress: ip,
        });
        token = refreshToken;

        break;

      default:
        break;
    }

    return {
      token,
      status: req.user.status,
      registerStatus,
      pincodeSet: req.user.pincodeSet,
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
    const token = await this.authService.validateBearerToken(
      req.headers,
      TokenTypeEnum.CreateAccount,
    );

    await this.authService.sendEmailVerificationCode(token.userId);

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
    const token = await this.authService.validateBearerToken(
      req.headers,
      TokenTypeEnum.CreateAccount,
    );

    await this.authService.confirmEmailVerificationCode(token.userId, body.code);

    return {
      isConfirmed: true,
    };
  }

  @ApiOperation({ description: `Send phone number verification code` })
  @ApiBearerAuth()
  @Post('send-phone-verification-code')
  async sendPhoneVerificationCode(
    @Req() req,
    @Body() body: SendPhoneVerificationCodeDto,
  ): Promise<any> {
    const token = await this.authService.validateBearerToken(
      req.headers,
      TokenTypeEnum.CreateAccount,
    );

    await this.authService.sendPhoneVerificationCode(token.userId, body);

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
    const token = await this.authService.validateBearerToken(
      req.headers,
      TokenTypeEnum.CreateAccount,
    );

    const res = await this.authService.confirmPhoneVerificationCode(token.userId, body.code);

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
    const userId = await this.authService.validateBearerToken(
      req.headers,
      TokenTypeEnum.AuthRefresh,
    );

    const { pincodeSet } = await this.userService.findOne({ id: userId });

    if (pincodeSet) {
      throw new BadRequestException('Pincode is already set');
    }

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
  ): Promise<{ accessToken: string }> {
    const userId = await this.authService.validateBearerToken(
      req.headers,
      TokenTypeEnum.AuthRefresh,
    );
    const validatedUser = await this.authService.validateUserByPincode(userId, body.pincode);
    const accessToken = await this.authService.createAccessToken(validatedUser);

    return {
      accessToken,
    };
  }

  @ApiOperation({ description: `Send email verification code for forgot pincode` })
  @ApiBearerAuth()
  @Post('send-email-verification-code-for-forgot-pincode')
  async sendEmailVerificationCodeForForgotPincode(@Req() req): Promise<any> {
    const userId = await this.authService.validateBearerToken(
      req.headers,
      TokenTypeEnum.AuthRefresh,
    );

    await this.authService.sendEmailVerificationCodeForForgotPincode(userId);

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
    const userId = await this.authService.validateBearerToken(
      req.headers,
      TokenTypeEnum.AuthRefresh,
    );

    await this.authService.confirmEmailOtpForForgotPassword(userId, body.code);

    const resetPincodeToken = await this.cipherTokenService.generateResetPincodeToken(userId);

    return { resetPincodeToken };
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
    await this.authService.sendEmailVerificationCodeForForgotPassword(body.email);

    return {
      isSent: true,
    };
  }

  @ApiOperation({ description: `Confirm email verification code for forgot password` })
  @Post('confirm-email-verification-code-for-forgot-password')
  async confirmEmailForForgotPassword(@Body() body: ConfirmEmailVerificationCodeForAdminDto) {
    const { id } = await this.userService.findOne({ email: body.email });

    await this.authService.confirmEmailOtpForForgotPassword(id, body.code);

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
      TokenTypeEnum.ResetPassword,
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

  @ApiOperation({ description: `Get sumsub api access token for development` })
  @ApiTags('Sumsub')
  @ApiBearerAuth()
  @Get('sumsub-access-token')
  async getSumsubAccessToken(@Req() req): Promise<{ token: string }> {
    const createAccountToken = await this.authService.validateBearerToken(
      req.headers,
      TokenTypeEnum.CreateAccount,
    );

    const accessToken = await this.authService.getSumsubAccessToken(createAccountToken.userId);

    return { token: accessToken };
  }
}
