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
import { PhoneNumberVerificationCodeDto } from './dto/phone-verification.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

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
    const res = await this.verificationService.sendVerificationCode(
      body.phoneNumber,
    );
    if (res === true) {
      return 'Phone number verification code was successfully sent';
    }
    throw new BadRequestException('Sorry, Can not send verification code');
  }

  @ApiOperation({ description: `Confirm phone number by verification code` })
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed`))
  @Post('auth/phone-verify')
  async confirmPhoneNumber(@Body() body: PhoneNumberVerificationCodeDto) {
    const res = await this.verificationService.confirmPhoneNumber(body);
    if (res === true) {
      await this.userService.makePhoneNumberVerified(body.phoneNumber);
      return 'Phone number verification code was successfully confirmed';
    }
    throw new BadRequestException('Sorry, Can not confirm phone number');
  }
}
