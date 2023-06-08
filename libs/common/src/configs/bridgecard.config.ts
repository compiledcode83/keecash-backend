import { registerAs } from '@nestjs/config';

export default registerAs('bridgecardConfig', () => ({
  baseUrl: process.env.BRIDGECARD_BASE_URL,
  baseUrlDecrypted: process.env.BRIDGECARD_BASE_URL_DECRYPTED,
  authToken: process.env.BRIDGECARD_AUTH_TOKEN,
  secretKey: process.env.BRIDGECARD_SECRET_KEY,
  issuingId: process.env.BRIDGECARD_ISSUING_ID,
  whSecretkey: process.env.BRIDGECARD_WEBHOOK_SECRET_KEY,
}));
