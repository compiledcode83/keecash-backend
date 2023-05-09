import { registerAs } from '@nestjs/config';

export default registerAs('sumsubConfig', () => ({
  sumsubAppToken: process.env.SUMSUB_APP_TOKEN,
  sumsubSecretKey: process.env.SUMSUB_SECRET_KEY,
  sumsubBaseUrl: process.env.SUMSUB_BASE_URL,
  sumsubAccessTokenDurationMinutes: process.env.SUMSUB_ACCESS_TOKEN_DURATION_MINUTES,
}));
