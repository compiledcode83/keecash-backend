import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfirmEmailVerificationCodeDto } from '@src/user/dto/confirm-email-verification.dto';
import { ConfirmPhoneNumberVerificationCodeDto } from '@src/user/dto/confirm-phone-verification.dto';
import { Twilio } from 'twilio';
const SMSCHANNEL = 'sms';
const EMAILCHANNEL = 'email';

@Injectable()
export class VerificationService {
  private twilioClient: Twilio;
  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>(
      'verificationConfig.twilioAccountSid',
    );
    const authToken = this.configService.get<string>(
      'verificationConfig.twilioAuthToken',
    );

    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async sendPhoneVerificationCode(phoneNumber: string): Promise<boolean> {
    const serviceId = this.configService.get<string>(
      'verificationConfig.twilioVerificationServiceSid',
    );
    const res = await this.twilioClient.verify
      .services(serviceId)
      .verifications.create({ to: phoneNumber, channel: SMSCHANNEL });

    if (res.status === 'pending') {
      return true;
    }
    return false;
  }

  async confirmPhoneNumberVerificationCode(
    body: ConfirmPhoneNumberVerificationCodeDto,
  ): Promise<boolean> {
    const serviceId = this.configService.get<string>(
      'verificationConfig.twilioVerificationServiceSid',
    );
    const result = await this.twilioClient.verify
      .services(serviceId)
      .verificationChecks.create({ to: body.phoneNumber, code: body.code });
    if (!result.valid || result.status !== 'approved') {
      return false;
    }
    return true;
  }

  async sendEmailVerificationCode(email: string): Promise<boolean> {
    const serviceId = this.configService.get<string>(
      'verificationConfig.twilioVerificationServiceSid',
    );
    const res = await this.twilioClient.verify
      .services(serviceId)
      .verifications.create({ to: email, channel: EMAILCHANNEL });

    if (res.status === 'pending') {
      return true;
    }
    return false;
  }

  async confirmEmailVerificationCode(
    body: ConfirmEmailVerificationCodeDto,
  ): Promise<boolean> {
    const serviceId = this.configService.get<string>(
      'verificationConfig.twilioVerificationServiceSid',
    );
    const result = await this.twilioClient.verify
      .services(serviceId)
      .verificationChecks.create({ to: body.email, code: body.code });
    if (!result.valid || result.status !== 'approved') {
      return false;
    }
    return true;
  }
}
