import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { SENDGRID_PROVIDER_TOKEN } from './sendgrid.types';

export const SendgridProvider = {
  provide: SENDGRID_PROVIDER_TOKEN,
  useFactory: async (configService: ConfigService): Promise<sgMail.MailService> => {
    const sendgridApiKey = configService.get('sendgridConfig.sendgridApiKey');

    sgMail.setApiKey(sendgridApiKey);

    return sgMail;
  },
  inject: [ConfigService],
};
