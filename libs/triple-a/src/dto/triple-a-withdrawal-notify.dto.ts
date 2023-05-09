import { FiatCurrencyEnum } from 'libs/transaction/src/transaction.types';

export class TripleAWithdrawalNotifyDto {
  payout_reference: string;
  order_id: string;
  local_currency: FiatCurrencyEnum;
}
