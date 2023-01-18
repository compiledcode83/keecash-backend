import { registerAs } from '@nestjs/config';

export default registerAs('verificationConfig', () => ({
  twilioVerificationServiceSid: process.env.TWILIO_VERIFICATION_SERVICE_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  sumsubAppToken: process.env.SUMSUB_APP_TOKEN,
  sumsubSecretKey: process.env.SUMSUB_SECRET_KEY,
  sumsubBaseUrl: process.env.SUMSUB_BASE_URL,
}));
