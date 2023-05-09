import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { TWILIO_PROVIDER_TOKEN } from './twilio.types';

export const TwilioProvider = {
  provide: TWILIO_PROVIDER_TOKEN,
  useFactory: async (configService: ConfigService): Promise<Twilio> => {
    const accountSid = configService.get('sumsubConfig.twilioAccountSid');
    const authToken = configService.get('sumsubConfig.twilioAuthToken');

    return new Twilio(accountSid, authToken);
  },
  inject: [ConfigService],
};
