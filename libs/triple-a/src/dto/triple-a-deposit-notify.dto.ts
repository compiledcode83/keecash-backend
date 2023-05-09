import { CryptoCurrencyEnum, FiatCurrencyEnum } from 'libs/transaction/src/transaction.types';

export class TripleADepositNotifyDto {
  payment_reference: string;
  order_currency: FiatCurrencyEnum;
  crypto_currency: CryptoCurrencyEnum;
  webhook_data: any;
}
