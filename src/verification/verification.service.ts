import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
const SMSCHANNEL = 'sms';

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

  async sendVerificationCode(phoneNumber: string): Promise<void> {
    const serviceId = this.configService.get<string>(
      'verificationConfi.twilioVerificationServiceSidg',
    );

    const res = await this.twilioClient.verify
      .services(serviceId)
      .verifications.create({ to: phoneNumber, channel: SMSCHANNEL });

    console.log(res);
  }
}
