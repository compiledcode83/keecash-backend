import { registerAs } from '@nestjs/config';

export default registerAs('coinlayerConfig', () => ({
  coinlayerBaseUrl: process.env.COINLAYER_BASE_URL,
  coinlayerKey: process.env.COINLAYER_KEY,
  coinlayerRefreshExchangeRateDurationMinutes:
    process.env.COINLAYER_REFRESH_EXCHANGE_RATE_DURATION_MINUTES,
}));
