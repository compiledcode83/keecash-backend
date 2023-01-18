import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { VerificationService } from '@src/verification/verification.service';
import { ConfirmPhoneNumberVerificationCodeDto } from './dto/confirm-phone-verification.dto';
import { UserService } from './user.service';
import { SendPhoneNumberVerificationCodeDto } from './dto/send-phone-verification.dto';
import { SendEmailVerificationCodeDto } from './dto/send-email-verification.dto';
import { ConfirmEmailVerificationCodeDto } from './dto/confirm-email-verification.dto';
import { CreatePersonUserDto } from './dto/create-person-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '@src/storage/storage.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetDto } from './dto/password-reset.dto';
import { CreateEnterpriseUserDto } from './dto/create-enterprise-user.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { ConfirmEmailVerificationCodeForAdminDto } from './dto/confirm-email-verification-for-admin.dto';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly verificationService: VerificationService,
    private readonly storageService: StorageService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ description: `Register a new user` })
  @Post('auth/register-person')
  async registerPerson(@Body() body: CreatePersonUserDto) {
    try {
      const emailPayload: any = this.jwtService.verify(body.emailToken);
      if (emailPayload.email != body.email)
        throw new BadRequestException('Please verify your email');
    } catch (err) {
      throw new BadRequestException('Please verify your email');
    }
    try {
      const phoneNumberPayload: any = this.jwtService.verify(
        body.phoneNumberToken,
      );
      if (phoneNumberPayload.phoneNumber != body.phoneNumber)
        throw new BadRequestException('Please verify your Phone Number');
    } catch (err) {
      throw new BadRequestException('Please verify your Phone Number');
    }
    await this.userService.createPersonalUser(body);
    return 'Success';
  }

  @ApiOperation({ description: `Register a new user` })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
        fileSize: 1024 * 1024,
      },
    }),
  )
  @Post('auth/register-enterprise')
  async registerEnterprise(@Body() body: CreateEnterpriseUserDto) {
    try {
      const emailPayload: any = this.jwtService.verify(body.emailToken);
      if (emailPayload.email != body.email)
        throw new BadRequestException('Please verify your email');
    } catch (err) {
      throw new BadRequestException('Please verify your email');
    }
    await this.userService.createEnterpriseUser(body);
    return 'Success';
  }

  @ApiOperation({ description: `Send phone number verification code` })
  @UseGuards(JwtAuthGuard)
  @Post('auth/send-phone-verification-code')
  async sendPhoneVerificationCode(
    @Request() req,
    @Body() body: SendPhoneNumberVerificationCodeDto,
  ) {
    return this.userService.sendPhoneOtp(req.user.email, body);
  }

  @ApiOperation({ description: `Confirm phone number verification code` })
  @Post('auth/confirm-phone-verification-code')
  @UseGuards(JwtAuthGuard)
  async confirmPhoneNumberVerificationCode(
    @Request() req,
    @Body() body: ConfirmPhoneNumberVerificationCodeDto,
  ) {
    const updatedUser = await this.userService.confirmPhoneOtp(
      req.user.email,
      body.code,
    );
    return this.userService.createAccessToken(updatedUser);
  }

  @ApiOperation({ description: `Send email verification code` })
  @UseGuards(JwtAuthGuard)
  @Post('auth/send-email-verification-code')
  async sendEmailVerificationCode(@Request() req) {
    return this.userService.sendEmailOtp(req.user.email);
  }

  @ApiOperation({ description: `Confirm email verification code` })
  @UseGuards(JwtAuthGuard)
  @Post('auth/confirm-email-verification-code')
  async confirmEmailVerificationCode(
    @Request() req,
    @Body() body: ConfirmEmailVerificationCodeDto,
  ) {
    const updatedUser = await this.userService.confirmEmailOtp(
      req.user.email,
      body.code,
    );
    return this.userService.createAccessToken(updatedUser);
  }

  @ApiOperation({
    description: `Send email verification code for forget password`,
  })
  @Post('auth/send-email-verification-code-for-forget-password')
  async sendEmailVerificationCodeForForgetPassword(
    @Body() body: SendEmailVerificationCodeDto,
  ) {
    const user = await this.userService.findByEmail(body.email);
    if (user == null) throw new BadRequestException('Sorry, Can not find user');
    const res = await this.verificationService.sendEmailVerificationCode(
      body.email,
    );
    if (res === true) {
      return 'Email verification code was successfully sent';
    }
    throw new BadRequestException('Sorry, Can not send verification code');
  }

  @ApiOperation({ description: `Confirm email verification code` })
  @Post('auth/confirm-email-verification-code-for-forget-password')
  async confirmEmailForForgetPassword(
    @Body() body: ConfirmEmailVerificationCodeForAdminDto,
  ) {
    const updatedUser = await this.userService.confirmEmailOtp(
      body.email,
      body.code,
    );
    return this.userService.createAccessToken(updatedUser);
  }

  @ApiOperation({ description: `Confirm email verification code` })
  @Post('auth/password-reset')
  async passwordReset(@Body() body: PasswordResetDto) {
    const payload: any = this.jwtService.verify(body.token);
    await this.userService.passwordReset(payload.email, body.password);
    return 'Successfully changed';
  }

  @ApiOperation({ description: `Check if referral id exists` })
  @Post('auth/check-referralid')
  async checkIfReferralIdExists() {
    return true;
  }

  @ApiOperation({ description: `Create account` })
  @Post('auth/create-account')
  async createAccount(@Body() body: CreateAccountDto) {
    const createdAccount = await this.userService.createAccount(body);
    const accessToken = await this.userService.createAccessToken(
      createdAccount,
    );
    return accessToken;
  }
}
