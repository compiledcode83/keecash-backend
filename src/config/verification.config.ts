import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  twilioVerificationServiceSid: process.env.TWILIO_VERIFICATION_SERVICE_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioAccountToken: process.env.TWILIO_ACCOUNT_SID,
}));
