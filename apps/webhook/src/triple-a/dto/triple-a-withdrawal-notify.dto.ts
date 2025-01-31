import { FiatCurrencyEnum } from '@app/common';

export class TripleAWithdrawalNotifyDto {
  payout_reference: string;
  order_id: string;
  local_currency: FiatCurrencyEnum;

  exchange_rate: number;

  crypto_amount: number;
}
