import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@api/transaction/transaction.types';

export class TripleADepositNotifyDto {
  payment_reference: string;

  order_currency: FiatCurrencyEnum;

  crypto_currency: CryptoCurrencyEnum;

  webhook_data: any;
}
