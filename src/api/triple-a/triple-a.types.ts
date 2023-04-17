import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@api/transaction/transaction.types';

export interface TripleADepositInterface {
  amount: number;
  currency: FiatCurrencyEnum;
  email: string;
  keecashUserId: string; // Referral ID
  // Webhook data
  keecashTransactionId: number;
}

export interface TripleADepositResponseInterface {
  hosted_url: string;
  expires_in: number;
  payment_reference: string;
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
