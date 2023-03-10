import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { VerificationService } from '@api/verification/verification.service';
import { ConfirmPhoneNumberVerificationCodeDto } from './dto/confirm-phone-verification.dto';
import { UserService } from './user.service';
import { SendPhoneNumberVerificationCodeDto } from './dto/send-phone-verification.dto';
import { SendEmailVerificationCodeDto } from './dto/send-email-verification.dto';
import { ConfirmEmailVerificationCodeDto } from './dto/confirm-email-verification.dto';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetDto } from './dto/password-reset.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from '@src/api/auth/guards/jwt-auth.guard';
import { ConfirmEmailVerificationCodeForAdminDto } from './dto/confirm-email-verification-for-admin.dto';
import { AddPersonUserInfoDto } from './dto/add-personal-user-info.dto';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly verificationService: VerificationService,
    private readonly jwtService: JwtService,
  ) {}

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
    const updatedUser = await this.userService.confirmPhoneOtp(req.user.email, body.code);

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
    const updatedUser = await this.userService.confirmEmailOtp(req.user.email, body.code);

    return this.userService.createAccessToken(updatedUser);
  }

  @ApiOperation({
    description: `Send email verification code for forget password`,
  })
  @Post('auth/send-email-verification-code-for-forget-password')
  async sendEmailVerificationCodeForForgetPassword(@Body() body: SendEmailVerificationCodeDto) {
    const user = await this.userService.findByEmail(body.email);
    if (user == null) throw new BadRequestException('Sorry, Can not find user');
    const res = await this.verificationService.sendEmailVerificationCode(body.email);
    if (res === true) {
      return 'Email verification code was successfully sent';
    }
    throw new BadRequestException('Sorry, Can not send verification code');
  }

  @ApiOperation({ description: `Confirm email verification code` })
  @Post('auth/confirm-email-verification-code-for-forget-password')
  async confirmEmailForForgetPassword(@Body() body: ConfirmEmailVerificationCodeForAdminDto) {
    const updatedUser = await this.userService.confirmEmailOtp(body.email, body.code);

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
    const accessToken = await this.userService.createAccessToken(createdAccount);
    await this.userService.sendEmailOtp(body.email);

    return accessToken;
  }

  @ApiOperation({ description: `Create account` })
  @UseGuards(JwtAuthGuard)
  @Post('auth/add-personal-user-info')
  async addPersonalUserInfo(@Request() req, @Body() body: AddPersonUserInfoDto) {
    const updatedUser = await this.userService.addPersonalUserInfo(req.user.email, body);

    return this.userService.createAccessToken(updatedUser);
  }

  @ApiOperation({ description: `Get sumsub api access token for development` })
  @Get('auth/dev-sumsub-access-token')
  async getSumsubAccessToken() {
    return {
      token: await this.userService.getSumsubAccessToken(),
      userId: 'JamesBond007',
    };
  }

  @ApiOperation({ description: 'Get all referred users' })
  @Get('referral')
  async getReferral(@Request() req) {
    const { referralId } = await this.userService.findOne(req.user.id);
    const referredUsers = await this.userService.getReferredUsersByReferralId(referralId);

    return {
      referral_id: referralId,
      godsons: referredUsers,
    };
  }
}
