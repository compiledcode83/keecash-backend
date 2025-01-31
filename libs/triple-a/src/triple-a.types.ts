import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@app/common';

export interface TripleADepositInterface {
  amount: number;
  currency: FiatCurrencyEnum;
  email: string;
  userUuid: string;
  webhookData: any;
}

export interface TripleADepositResponseInterface {
  payment_reference: string;
  order_currency?: FiatCurrencyEnum;
  order_amount?: number;
  expiry_date?: string;
  notify_secret?: string;
  access_token?: string;
  token_type?: string;
  expires_in: number;
  hosted_url: string;
}

export interface TripleAWithdrawInterface {
  amount: number;
  currency: FiatCurrencyEnum;
  cryptocurrency: CryptoCurrencyEnum;
  walletAddress: string;
  name: string;
  country: string;
  email: string;
  keecashUserId: string;
  reason: string;
}

export interface TripleAWithdrawResponseInterface {
  fee: number;
  crypto_amount: number;
  exnetwork_fee_crypto_amount: number;
  net_crypto_amount: number;
  payout_reference: string;
  local_currency: string;
  crypto_currency: string;
  exchange_rate: number;
}
