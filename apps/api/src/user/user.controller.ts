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
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
<<<<<<< HEAD:apps/api/src/user/user.controller.ts
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TwilioService } from '@app/twilio';
=======
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
>>>>>>> 381621e06e83efe140d01ba95f21884ffdfb849c:src/api/user/user.controller.ts
import { JwtAuthGuard } from '@api/auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { GetReferralResponseDto } from './dto/get-referral-response.dto';
import { SetLanguageDto } from './dto/set-language.dto';
import { RequestEmailChangeDto } from './dto/request-email-change.dto';
import { CloseAccountDto } from './dto/close-account.dto';
import { ConfirmEmailChangeOtpDto } from './dto/confirm-email-change-otp.dto';
import { VerifyUserExistDto } from './dto/verify-user-exist.dto';
import { VerifyUserExistResponseDto } from './dto/verify-user-exist-response.dto';
<<<<<<< HEAD:apps/api/src/user/user.controller.ts
=======
import { TwilioService } from '@api/twilio/twilio.service';
import e from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileExtender } from './interceptor/file-extender.interceptor';
import { StorageService } from '@api/storage/storage.service';
>>>>>>> 381621e06e83efe140d01ba95f21884ffdfb849c:src/api/user/user.controller.ts

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly twilioService: TwilioService,
    private readonly storageService: StorageService,
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
  @ApiOkResponse({
    description: 'Account setting response',
    schema: {
      example: {
        firstname: 'firstname',
        lastname: 'mayissa',
        url_avatar: 'https://img.example.com',
        email: 'test@test.com',
        country_code: 'CM',
        phone_number: '+2376******3',
        account_level: 'PERSON',
        list_lang: [
          {
            lang: 'fr',
            is_checked: true,
          },
          {
            lang: 'en',
            is_checked: false,
          },
        ],
        list_reason_to_close_account: [
          {
            reason: 'Les frais sont trop élevés pour moi',
            is_checked: false,
          },
          {
            reason: 'Trop de bugs',
            is_checked: false,
          },
          {
            reason: "J'ai trouvé une autre application",
            is_checked: false,
          },
          {
            reason: 'Mon mode de paiement préféré est manquant',
            is_checked: false,
          },
          {
            reason: 'Ma méthode de retrait préférée est manquante',
            is_checked: false,
          },
          {
            reason: 'Ma carte est refusée plusieurs fois',
            is_checked: false,
          },
          {
            reason: 'Un ou plusieurs services ne sont pas activés dans mon pays',
            is_checked: false,
          },
        ],
        keecash_wallets: [
          {
            currency: 'USD',
            balance: '3.74',
          },
          {
            currency: 'EUR',
            balance: '7.20',
          },
        ],
        cards: [
          {
            card_name: 'Business',
            balance: 2.36,
            currency: 'USD',
          },
        ],
      },
    },
  })
  @ApiTags('Account management')
  @UseGuards(JwtAuthGuard)
  @Get('account/settings')
  async getAccountSettings(@Req() req) {
    // const settings = await this.userService.getAccountSettings(req.user.id);
    // return settings;
  }

  @ApiOperation({ description: 'Upload picture' })
  @ApiBearerAuth()
  @ApiTags('Account management')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileExtender)
  @UseInterceptors(FileInterceptor('file'))
  @Post('account/upload-picture')
  async uploadPicture(
    @Req() req: any,
    @UploadedFile('file') file: { mimetype: string; buffer: Buffer },
  ) {
    return this.storageService.save(`user_avatar/${req.user.uuid}`, file.mimetype, file.buffer);
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
    const user = await this.userService.findOne(body.email);

    await this.twilioService.sendEmailVerificationCode(body.email, user.language);
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

  // ------------ Beneficiary ----------------

  @ApiOperation({ description: `Verify if user exists` })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Verification response',
    type: VerifyUserExistResponseDto,
  })
  @ApiTags('Manage beneficiaries')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('beneficiary/verify-user-exist')
  async verifyUserExist(@Query() query: VerifyUserExistDto): Promise<VerifyUserExistResponseDto> {
    const user = await this.userService.findByEmailPhoneNumberReferralId(query.user);

    if (user) {
      return {
        valid: true,
        beneficiaryUserId: user.id,
        beneficiaryName: `${user.lastName} ${user.firstName}`,
      };
    } else {
      return {
        valid: false,
        beneficiaryUserId: 0,
        beneficiaryName: '',
      };
    }
  }

  // -------------- SUMSUB WEBHOOK -------------------

  @ApiTags('Webhook Handler')
  @Post('sumsub/webhook')
  async handleSumsubWebhookEvent(@Body() body: any) {
    await this.userService.handleSumsubWebhookEvent(body);
  }
}
