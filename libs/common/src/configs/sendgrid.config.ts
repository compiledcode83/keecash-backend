import { registerAs } from '@nestjs/config';

export default registerAs('sendgridConfig', () => ({
  sendgridApiKey: process.env.SENDGRID_API_KEY,
}));
