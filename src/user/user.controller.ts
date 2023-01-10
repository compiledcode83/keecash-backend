import {
  BadRequestException,
  Body,
  Controller,
  Post,
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
import { ReferralIdExistsDto } from './dto/referral-id-exists.dto';

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
  @Post('auth/send-phone-verification-code')
  async sendPhoneVerificationCode(
    @Body() body: SendPhoneNumberVerificationCodeDto,
  ) {
    const res = await this.verificationService.sendPhoneVerificationCode(
      body.phoneNumber,
    );
    if (res === true) {
      return 'Phone number verification code was successfully sent';
    }
    throw new BadRequestException('Sorry, Can not send verification code');
  }

  @ApiOperation({ description: `Confirm phone number verification code` })
  @Post('auth/confirm-phone-verification-code')
  async confirmPhoneNumber(
    @Body() body: ConfirmPhoneNumberVerificationCodeDto,
  ) {
    const res =
      await this.verificationService.confirmPhoneNumberVerificationCode(body);
    const payload = { phoneNumber: body.phoneNumber };
    const token = await this.jwtService.signAsync(payload);
    if (res === true) return { phoneNumberToken: token };
    throw new BadRequestException('Sorry, Can not confirm phone number');
  }

  @ApiOperation({ description: `Send email verification code` })
  @Post('auth/send-email-verification-code')
  async sendEmailVerificationCode(@Body() body: SendEmailVerificationCodeDto) {
    const res = await this.verificationService.sendEmailVerificationCode(
      body.email,
    );
    if (res === true) {
      return 'Email verification code was successfully sent';
    }
    throw new BadRequestException('Sorry, Can not send verification code');
  }

  @ApiOperation({ description: `Confirm email verification code` })
  @Post('auth/confirm-email-verification-code')
  async confirmEmail(@Body() body: ConfirmEmailVerificationCodeDto) {
    const res = await this.verificationService.confirmEmailVerificationCode(
      body,
    );
    const payload = { email: body.email };
    const token = await this.jwtService.signAsync(payload);
    if (res === true) return { emailToken: token };
    throw new BadRequestException(
      'Sorry, Can not confirm email verification code',
    );
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
    @Body() body: ConfirmEmailVerificationCodeDto,
  ) {
    const res = await this.verificationService.confirmEmailVerificationCode(
      body,
    );
    const payload = { email: body.email };
    const token = await this.jwtService.signAsync(payload);
    if (res === true) return { token: token };
    throw new BadRequestException('Sorry, Can not confirm phone number');
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
  async checkIfReferralIdExists(@Body() body: ReferralIdExistsDto) {
    return true;
  }
}
