import { registerAs } from '@nestjs/config';

export default registerAs('tripleAConfig', () => ({
  tripleAApiBaseUrl: process.env.TRIPLEA_API_BASE_URL,
  tripleAUSDClientId: process.env.TRIPLEA_USD_CLIENT_ID,
  tripleAUSDClientSecret: process.env.TRIPLEA_USD_CLIENT_SECRET,
  tripleAUSDMerchantKey: process.env.TRIPLEA_USD_MERCHANT_KEY,
  tripleAEURClientId: process.env.TRIPLEA_EUR_CLIENT_ID,
  tripleAEURClientSecret: process.env.TRIPLEA_EUR_CLIENT_SECRET,
  tripleAEURMerchantKey: process.env.TRIPLEA_EUR_MERCHANT_KEY,
  tripleANotifyUrl: process.env.TRIPLEA_NOTIFY_URL,
}));
