import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@app/common';

export class TripleADepositNotifyDto {
  payment_reference: string;
  order_currency: FiatCurrencyEnum;
  crypto_currency: CryptoCurrencyEnum;
  webhook_data: any;
}
