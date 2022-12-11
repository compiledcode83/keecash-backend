import { registerAs } from '@nestjs/config';

export default registerAs('cryptoConfig', () => ({
  tripleaClientId: process.env.TRIPLEA_CLIENT_ID,
  tripleaClientSecret: process.env.TRIPLEA_CLIENT_SECRET,
  tripleaMerchantKey: process.env.TRIPLEA_MERCHANT_KEY,
  tripleaTestApiId: process.env.TRIPLEA_TEST_API_ID,
}));
