import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@app/common';

export class TripleADepositNotifyDto {
  payment_reference: string;
  order_currency: FiatCurrencyEnum;
  crypto_currency: CryptoCurrencyEnum;
  webhook_data: any;
  status: string;
}

// --------------- Example Webhook Data ---------------

// {
//   "event": "payment",
//   "merchant_key": "mkey-clbpnbrln000a08mz64nn8h1w",
//   "api_id": "USDTTRC2016711428863jy",
//   "payment_reference": "WBB-507831-PMT",
//   "crypto_address": "TDtxqgNUNhPDfQZNoJ4YwyCi1Xuk1jB4pN",
//   "crypto_currency": "USDT_TRC20",
//   "crypto_amount": 2,
//   "order_currency": "USD",
//   "order_amount": 2,
//   "exchange_rate": 1,
//   "webhook_data": {},
//   "receive_amount": 2,
//   "payment_tier": "good",
//   "payment_tier_date": "2023-06-02T10:15:46.504Z",
//   "payment_currency": "USD",
//   "payment_amount": 2,
//   "payment_crypto_amount": 2,
//   "transaction_fee_amount": "0.02",
//   "vat_amount": "0.00",
//   "status": "good",
//   "status_date": "2023-06-02T10:15:46.504Z"
// }
