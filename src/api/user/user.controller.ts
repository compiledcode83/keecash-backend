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
  Delete,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { GetReferralResponseDto } from './dto/get-referral-response.dto';
import { SetLanguageDto } from './dto/set-language.dto';
import { RequestEmailChangeDto } from './dto/request-email-change.dto';
import { CloseAccountDto } from './dto/close-account.dto';
import { ConfirmEmailChangeOtpDto } from './dto/confirm-email-change-otp.dto';
import { VerificationService } from '@api/verification/verification.service';
import { SubmitKycInfoDto } from './dto/submit-kyc-info.dto';
import { CipherTokenService } from '@api/cipher-token/cipher-token.service';
import { TokenTypeEnum } from '@api/cipher-token/cipher-token.types';
import { VerificationStatus } from './user.types';
import { VerifyUserExistDto } from './dto/verify-user-exist.dto';
import { VerifyUserExistResponseDto } from './dto/verify-user-exist-response.dto';
import { SumsubWebhookResponseDto } from './dto/sumsub-webhook-response.dto';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly verificationService: VerificationService,
    private readonly cipherTokenService: CipherTokenService,
  ) {}

  // ------------ Referral ----------------

  @ApiOperation({ description: 'Get all referred users' })
  @ApiBearerAuth()
  @ApiTags('Get referrals')
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

  // ------------ Account Settings ----------------

  @ApiOperation({ description: 'Get all referred users' })
  @ApiBearerAuth()
  @ApiTags('Account management')
  @UseGuards(JwtAuthGuard)
  @Get('account/settings')
  async getAccountSettings(@Req() req) {
    const settings = await this.userService.getAccountSettings(req.user.id);

    return settings;
  }

  @ApiOperation({ description: 'Upload picture' })
  @ApiBearerAuth()
  @ApiTags('Account management')
  @UseGuards(JwtAuthGuard)
  @Post('account/upload-picture')
  async uploadPicture() {
    return { message: 'Single file uploaded successfully' };
  }

  @ApiOperation({ description: 'Change languaeg setting' })
  @ApiBearerAuth()
  @ApiTags('Account management')
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
  @ApiTags('Account management')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('account/request-email-change')
  async requestEmailChange(@Req() req, @Body() body: RequestEmailChangeDto): Promise<void> {
    await this.verificationService.sendEmailVerificationCode(body.email);
  }

  @ApiOperation({ description: 'Confirm OTP & change email' })
  @ApiBearerAuth()
  @ApiTags('Account management')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('account/confirm-email-change-otp')
  async confirmEmailChangeOtp(@Req() req, @Body() body: ConfirmEmailChangeOtpDto): Promise<void> {
    await this.userService.confirmEmailChangeOtp(req.user.id, body.email, body.otp);

    return;
  }

  @ApiOperation({ description: 'Close account' })
  @ApiBearerAuth()
  @ApiTags('Account management')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('account/remove')
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

  // ------------ KYC ----------------

  @ApiOperation({ description: `Submit KYC information` })
  @ApiBearerAuth()
  @ApiTags('KYC')
  @Post('kyc/submitted')
  async submitKycInfo(@Req() req, @Body() body: SubmitKycInfoDto) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Missing CreateAccountToken in the header');
    }

    const bearerCreateAccountToken = req.headers.authorization.split(' ')[1];

    const token = await this.cipherTokenService.findOneBy({
      token: bearerCreateAccountToken,
      type: TokenTypeEnum.CreateAccount,
    });

    if (!token) {
      throw new UnauthorizedException('CreateAccountToken is invalid');
    }

    await this.userService.submitKycInfo(token.userId, body);
  }

  @ApiOperation({ description: `KYC submission approved` })
  @ApiBearerAuth()
  @ApiTags('KYC')
  @Patch('kyc/approved')
  async kycApproved(@Req() req): Promise<void> {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Missing CreateAccountToken in the header');
    }

    const bearerCreateAccountToken = req.headers.authorization.split(' ')[1];

    const token = await this.cipherTokenService.findOneBy({
      token: bearerCreateAccountToken,
      type: TokenTypeEnum.CreateAccount,
    });

    if (!token) {
      throw new UnauthorizedException('CreateAccountToken is invalid');
    }

    await this.userService.completeAccount(token.userId);

    // Delete create-account token once onboarding is finished
    await this.cipherTokenService.deleteByToken(token.token);
  }

  @ApiOperation({ description: `KYC submission rejected` })
  @ApiBearerAuth()
  @ApiTags('KYC')
  @Patch('kyc/rejected')
  async kycRejected(@Req() req): Promise<void> {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Missing CreateAccountToken in the header');
    }

    const bearerCreateAccountToken = req.headers.authorization.split(' ')[1];

    const token = await this.cipherTokenService.findOneBy({
      token: bearerCreateAccountToken,
      type: TokenTypeEnum.CreateAccount,
    });

    if (!token) {
      throw new UnauthorizedException('CreateAccountToken is invalid');
    }

    await this.userService.update(token.userId, { kycStatus: VerificationStatus.Rejected });
  }

  // @ApiOperation({ description: `Get sumsub api access token for development` })
  // @Get('auth/dev-sumsub-access-token')
  // async getSumsubAccessToken() {
  //   return {
  //     token: await this.userService.getSumsubAccessToken(),
  //     userId: 'JamesBond007',
  //   };
  // }

  // ------------ Beneficiary ----------------

  @ApiOperation({ description: `Verify if user exists` })
  @ApiTags('Manage beneficiaries')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('beneficiary/verify-user-exist')
  async verifyUserExist(@Query() query: VerifyUserExistDto): Promise<VerifyUserExistResponseDto> {
    const user = await this.userService.findByEmailPhoneNumberReferralId(query.user);

    if (user) {
      return { valid: true, beneficiaryUserId: user.id };
    } else {
      return { valid: false };
    }
  }

  // -------------- SUMSUB WEBHOOK -------------------

  @ApiTags('Webhook Handler')
  @Post('sumsub/kyc-verified')
  async handleWebhookEvent(@Body() body: SumsubWebhookResponseDto) {
    const { userId } = body;

    await this.userService.completeAccount(userId);
  }
}
