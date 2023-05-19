import { registerAs } from '@nestjs/config';

export default registerAs('tripleAConfig', () => ({
  tripleAApiBaseUrl: process.env.TRIPLEA_API_BASE_URL,
  tripleATokenDurationMinutes: process.env.TRIPLEA_TOKEN_DURATION_MINUTES,
  tripleAUSDClientId: process.env.TRIPLEA_USD_CLIENT_ID,
  tripleAUSDClientSecret: process.env.TRIPLEA_USD_CLIENT_SECRET,
  tripleAUSDMerchantKey: process.env.TRIPLEA_USD_MERCHANT_KEY,
  tripleAEURClientId: process.env.TRIPLEA_EUR_CLIENT_ID,
  tripleAEURClientSecret: process.env.TRIPLEA_EUR_CLIENT_SECRET,
  tripleAEURMerchantKey: process.env.TRIPLEA_EUR_MERCHANT_KEY,
  tripleANotifyUrl: process.env.TRIPLEA_NOTIFY_URL,
  tripleANotifySecret: process.env.TRIPLEA_NOTIFY_SECRET,

  tripleAEURBTCId: process.env.TRIPLEA_EUR_BTC_ID,
  tripleAEURETHId: process.env.TRIPLEA_EUR_ETH_ID,
  tripleAEURLNBCId: process.env.TRIPLEA_EUR_LNBC_ID,
  tripleAEURUSDCId: process.env.TRIPLEA_EUR_USDC_ID,
  tripleAEURUSDTERC20Id: process.env.TRIPLEA_EUR_USDT_ERC20_ID,
  tripleAEURUSDTTRC20Id: process.env.TRIPLEA_EUR_USDT_TRC20_ID,
  tripleAEURBinanceId: process.env.TRIPLEA_EUR_BINANCE_ID,

  tripleAUSDBTCId: process.env.TRIPLEA_USD_BTC_ID,
  tripleAUSDETHId: process.env.TRIPLEA_USD_ETH_ID,
  tripleAUSDLNBCId: process.env.TRIPLEA_USD_LNBC_ID,
  tripleAUSDUSDCId: process.env.TRIPLEA_USD_USDC_ID,
  tripleAUSDUSDTERC20Id: process.env.TRIPLEA_USD_USDT_ERC20_ID,
  tripleAUSDUSDTTRC20Id: process.env.TRIPLEA_USD_USDT_TRC20_ID,
  tripleAUSDBinanceId: process.env.TRIPLEA_USD_BINANCE_ID,
}));
