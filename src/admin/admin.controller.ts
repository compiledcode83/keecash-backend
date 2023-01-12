import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from '@src/auth/auth.service';
import { LocalAuthGuard } from '@src/auth/guards/local-auth.guard';
import { ConfirmEmailVerificationCodeDto } from '@src/user/dto/confirm-email-verification.dto';
import { AccountType } from '@src/user/table/user.entity';
import { UserService } from '@src/user/user.service';
import { AdminService } from './admin.service';
import { FindUserInfoDto } from './dto/find-user-info.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ description: `Admin login` })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request) {
    if (
      request.user.accountType === AccountType.SUPER_ADMIN ||
      request.user.accountType === AccountType.COUNTRY_MANAGER
    ) {
      const res = await this.adminService.sendOTPToEmail(request.user.email);
      if (res) return 'Security OTP sent your email successfully';
    }
    throw new BadRequestException('Can not send Security OTP');
  }

  @ApiOperation({ description: `Confirm OTP for email verification` })
  @Post('confirm-otp')
  async confirmOtp(
    @Request() request,
    @Body() body: ConfirmEmailVerificationCodeDto,
  ) {
    const res = await this.adminService.confirmOtp(body);
    if (res) {
      const user = await this.userService.findByEmail(body.email);
      const accessToken = await this.authService.createAccessToken(user);
      return { accessToken };
    }
    throw new BadRequestException('Invalid code');
  }

  @ApiOperation({
    description: `Get User Info By Filter(email, phone, referral id)`,
  })
  @Post('find_userinfo')
  async findUserInfo(@Request() request, @Body() body: FindUserInfoDto) {
    const user = await this.userService.findByEmailPhonenumberReferralId(
      body.userId,
    );
    if (user) {
      if (user.accountType === AccountType.PERSON)
        return this.userService.getPersonUserInfo();
    }
    return 'Can not find user';
  }
}
