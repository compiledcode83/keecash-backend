import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TWILIO_PROVIDER_TOKEN } from './twilio.types';

const SMSCHANNEL = 'sms';
const EMAILCHANNEL = 'email';

@Injectable()
export class TwilioService {
  private readonly serviceId: string;

  constructor(@Inject(TWILIO_PROVIDER_TOKEN) public twilioClient, configService: ConfigService) {
    this.serviceId = configService.get('twilioConfig.twilioVerificationServiceSid');
  }

  async sendPhoneVerificationCode(phoneNumber: string): Promise<boolean> {
    const res = await this.twilioClient.verify
      .services(this.serviceId)
      .verifications.create({ to: phoneNumber, channel: SMSCHANNEL });

    if (res.status === 'pending') {
      return true;
    }

    return false;
  }

  async confirmPhoneNumberVerificationCode(phonenumber: string, code: string): Promise<boolean> {
    const result = await this.twilioClient.verify
      .services(this.serviceId)
      .verificationChecks.create({ to: phonenumber, code });

    if (!result.valid || result.status !== 'approved') {
      return false;
    }

    return true;
  }

  async sendEmailVerificationCode(email: string): Promise<boolean> {
    const res = await this.twilioClient.verify
      .services(this.serviceId)
      .verifications.create({ to: email, channel: EMAILCHANNEL });

    if (res.status === 'pending') {
      return true;
    }

    return false;
  }

  async confirmEmailVerificationCode(email: string, code: string): Promise<boolean> {
    const result = await this.twilioClient.verify
      .services(this.serviceId)
      .verificationChecks.create({ to: email, code: code });

    if (!result.valid || result.status !== 'approved') {
      return false;
    }

    return true;
  }
}
