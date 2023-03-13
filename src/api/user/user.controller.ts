import { Controller, Request, UseGuards, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfirmPhoneNumberVerificationCodeDto } from './dto/confirm-phone-verification.dto';
import { UserService } from './user.service';
import { SendPhoneNumberVerificationCodeDto } from './dto/send-phone-verification.dto';
import { SendEmailVerificationCodeDto } from './dto/send-email-verification.dto';
import { ConfirmEmailVerificationCodeDto } from './dto/confirm-email-verification.dto';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetDto } from './dto/password-reset.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { ConfirmEmailVerificationCodeForAdminDto } from './dto/confirm-email-verification-for-admin.dto';
import { AddPersonUserInfoDto } from './dto/add-personal-user-info.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  @ApiTags('Get referrals')
  @ApiOperation({ description: 'Get all referred users' })
  @UseGuards(JwtAuthGuard)
  @Get('referral')
  async getReferral(@Request() req) {
    const { referralId } = await this.userService.findOneById(req.user.id);
    const referredUsers = await this.userService.getReferredUsersByReferralId(referralId);

    return {
      referral_id: referralId,
      godsons: referredUsers,
    };
  }

  // @ApiOperation({ description: `Check if referral id exists` })
  // @Post('auth/check-referralid')
  // async checkIfReferralIdExists() {
  //   return true;
  // }

  // @ApiOperation({ description: `Create account` })
  // @UseGuards(JwtAuthGuard)
  // @Post('auth/add-personal-user-info')
  // async addPersonalUserInfo(@Request() req, @Body() body: AddPersonUserInfoDto) {
  //   const updatedUser = await this.userService.addPersonalUserInfo(req.user.email, body);

  //   return this.userService.createAccessToken(updatedUser);
  // }

  // @ApiOperation({ description: `Get sumsub api access token for development` })
  // @Get('auth/dev-sumsub-access-token')
  // async getSumsubAccessToken() {
  //   return {
  //     token: await this.userService.getSumsubAccessToken(),
  //     userId: 'JamesBond007',
  //   };
  // }
}
