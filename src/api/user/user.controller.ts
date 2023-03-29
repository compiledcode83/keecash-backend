import {
  Controller,
  Req,
  UseGuards,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { GetReferralResponseDto } from './dto/get-referral-response.dto';
import { SetLanguageDto } from './dto/set-language.dto';
import { RequestEmailChangeDto } from './dto/request-email-change.dto';
import { CloseAccountDto } from './dto/close-account.dto';
import { ConfirmEmailChangeOtpDto } from './dto/confirm-email-change-otp.dto';

@Controller()
@ApiTags('Users Info')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ description: 'Get all referred users' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('referral')
  async getReferral(@Req() req): Promise<GetReferralResponseDto> {
    const { referralId } = await this.userService.findOne({ id: req.user.id });
    const referredUsers = await this.userService.getReferredUsersByReferralId(referralId);

    return {
      referral_id: referralId,
      godsons: referredUsers,
    };
  }

  @ApiOperation({ description: 'Get all referred users' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('account/settings')
  async getAccountSettings(@Req() req) {
    const settings = await this.userService.getAccountSettings(req.user.id);

    return settings;
  }

  @ApiOperation({ description: 'Upload picture' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('account/upload-picture')
  async uploadPicture() {
    return { message: 'Single file uploaded successfully' };
  }

  @ApiOperation({ description: 'Change languaeg setting' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('account/set-language')
  async setLanguage(@Req() req, @Body() body: SetLanguageDto): Promise<boolean> {
    const updated = await this.userService.update(req.user.id, body);

    if (updated) return true;

    return false;
  }

  @ApiOperation({ description: 'Request changing email & send OTP' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('account/request-email-change')
  async requestEmailChange(@Req() req, @Body() body: RequestEmailChangeDto): Promise<void> {
    await this.userService.findUserAndSendOtp({ email: body.email });
  }

  @ApiOperation({ description: 'Confirm OTP & change email' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('account/confirm-email-change-otp')
  async confirmEmailChangeOtp(@Req() req, @Body() body: ConfirmEmailChangeOtpDto): Promise<void> {
    await this.userService.confirmEmailChangeOtp(req.user.id, body.email, body.otp);

    return;
  }

  @ApiOperation({ description: 'Close account' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('account/remove')
  async closeAccount(@Req() req, @Body() body: CloseAccountDto): Promise<void> {
    await this.userService.closeAccount(
      req.user.id,
      body.closureReasons,
      body.leavingMessage,
      body.password,
    );

    return;
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
