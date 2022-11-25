import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PhoneNumberVerificationCodeDto } from '@src/user/dto/phone-verification.dto';
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

  async sendVerificationCode(phoneNumber: string): Promise<boolean> {
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

  async confirmPhoneNumber(
    body: PhoneNumberVerificationCodeDto,
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
}
