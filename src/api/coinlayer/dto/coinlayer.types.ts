export interface CoinlayerInterface {
  success: boolean;
  terms: string;
  privacy: string;
  timestamp: number;
  target: 'USD' | 'EUR';
  rates: RawRates;
}

export interface ExchangeRateInterface {
  EUR: RawRates;
  USD: RawRates;
  updated_at: string;
}

interface RawRates {
  BTC: number;
  ETH: number;
  USDT: number;
}
