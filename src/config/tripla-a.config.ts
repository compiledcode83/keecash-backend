import { registerAs } from '@nestjs/config';

export default registerAs('tripleAConfig', () => ({
  tripleaApiBaseUrl: process.env.TRIPLEA_API_BASE_URL,
  tripleaUSDClientId: process.env.TRIPLEA_USD_CLIENT_ID,
  tripleaUSDClientSecret: process.env.TRIPLEA_USD_CLIENT_SECRET,
  tripleaUSDMerchantKey: process.env.TRIPLEA_USD_MERCHANT_KEY,
  tripleaEURClientId: process.env.TRIPLEA_EUR_CLIENT_ID,
  tripleaEURClientSecret: process.env.TRIPLEA_EUR_CLIENT_SECRET,
  tripleaEURMerchantKey: process.env.TRIPLEA_EUR_MERCHANT_KEY,
  tripleaNotifyUrl: process.env.TRIPLEA_NOTIFY_URL,
}));
