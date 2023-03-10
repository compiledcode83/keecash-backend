import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginAdminDto } from '@src/admin/admin-auth/dto/login-admin.dto';
import { ConfirmEmailVerificationCodeForAdminDto } from '@src/api/user/dto/confirm-email-verification-for-admin.dto';
import { ApiResponseHelper } from '@src/common/helpers/api-response.helper';
import { Admin } from '../admin/admin.entity';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { JwtAdminAuthGuard } from './guards/jwt-admin-auth.guard';

@Controller()
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @ApiOperation({ description: `Admin login` })
  @ApiResponse(ApiResponseHelper.success(Admin))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed`))
  @UseGuards(AdminAuthGuard)
  @Post('login')
  async login(@Request() request, @Body() body: LoginAdminDto) {
    console.log('admin-login');
    return this.adminAuthService.login(body);
  }

  @ApiOperation({
    description: `Confirm OTP for email verification for admin login`,
  })
  @Post('confirm-otp')
  async confirmOtp(@Request() request, @Body() body: ConfirmEmailVerificationCodeForAdminDto) {
    const accessToken = await this.adminAuthService.confirmOtpForAdmin(body);

    return { accessToken };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  @Get('/profile')
  async successAdmin(@Request() req) {
    return req.user;
  }
}
