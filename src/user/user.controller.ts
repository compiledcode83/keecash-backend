import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResponseHelper } from '@src/common/helpers/api-response.helper';
import { VerificationService } from '@src/verification/verification.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfirmPhoneNumberVerificationCodeDto } from './dto/confirm-phone-verification.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { SendPhoneNumberVerificationCodeDto } from './dto/send-phone-verification.dto';
import { SendEmailVerificationCodeDto } from './dto/send-email-verification.dto';
import { ConfirmEmailVerificationCodeDto } from './dto/confirm-email-verification.dto';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly verificationService: VerificationService,
  ) {}

  @ApiOperation({ description: `Register a new user` })
  @ApiResponse(ApiResponseHelper.success(User, HttpStatus.CREATED))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed`))
  @Post('auth/register')
  async register(@Body() body: CreateUserDto) {
    await this.userService.create(body);
    return 'Success';
  }

  @ApiOperation({ description: `Send phone number verification code` })
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed`))
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
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed`))
  @Post('auth/confirm-phone-verification-code')
  async confirmPhoneNumber(
    @Body() body: ConfirmPhoneNumberVerificationCodeDto,
  ) {
    const res =
      await this.verificationService.confirmPhoneNumberVerificationCode(body);
    if (res === true) return 'Phone number successfully verified';
    throw new BadRequestException('Sorry, Can not confirm phone number');
  }

  @ApiOperation({ description: `Send email verification code` })
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed`))
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
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed`))
  @Post('auth/confirm-email-verification-code')
  async confirmEmail(@Body() body: ConfirmEmailVerificationCodeDto) {
    const res = await this.verificationService.confirmEmailVerificationCode(
      body,
    );
    if (res === true) return 'Email successfully verified';
    throw new BadRequestException('Sorry, Can not confirm phone number');
  }
}
