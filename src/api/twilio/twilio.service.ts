import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TWILIO_PROVIDER_TOKEN } from './twilio.types';
import { Twilio } from 'twilio';
import { Language } from '@api/user/user.types';

const SMSCHANNEL = 'sms';
const EMAILCHANNEL = 'email';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);
  private serviceId: string;

  constructor(
    @Inject(TWILIO_PROVIDER_TOKEN) public twilioClient: Twilio,
    configService: ConfigService,
  ) {
    this.serviceId = configService.get('twilioConfig.twilioVerificationServiceSid');
  }

  async sendPhoneVerificationCode(phoneNumber: string, language: Language): Promise<boolean> {
    try {
      const res = await this.twilioClient.verify
        .services(this.serviceId)
        .verifications.create({ to: phoneNumber, channel: SMSCHANNEL, locale: language });

      if (res.status === 'pending') return true;
      else return false;
    } catch (error) {
      this.logger.error('Cannot send phone verification code');

      return false;
    }
  }

  async confirmPhoneVerificationCode(phoneNumber: string, code: string): Promise<boolean> {
    try {
      const res = await this.twilioClient.verify
        .services(this.serviceId)
        .verificationChecks.create({ to: phoneNumber, code });

      if (res.status === 'approved') return true;
      else false;
    } catch (error) {
      this.logger.error('Cannot confirm phone verification code');

      return false;
    }
  }

  async sendEmailVerificationCode(email: string, language?: Language): Promise<boolean> {
    try {
      const res = await this.twilioClient.verify
        .services(this.serviceId)
        .verifications.create({ to: email, channel: EMAILCHANNEL, locale: language });

      if (res.status === 'pending') return true;
      else return false;
    } catch (error) {
      this.logger.error('Cannot send email verification code');

      return false;
    }
  }

  async confirmEmailVerificationCode(email: string, code: string): Promise<boolean> {
    try {
      const res = await this.twilioClient.verify
        .services(this.serviceId)
        .verificationChecks.create({ to: email, code: code });

      if (res.status === 'approved') return true;
      else false;
    } catch (error) {
      this.logger.error('Cannot confirm email verification code');

      return false;
    }
  }
}
