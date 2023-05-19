import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@api/transaction/transaction.types';
import { User } from '@api/user/user.entity';

export interface TripleADepositInterface {
  amount: number;
  desired_amount: number;
  currency: FiatCurrencyEnum;
  email: string;
  keecashUserId: string; // Referral ID
  crypto: CryptoCurrencyEnum;
  user: User;
  // Webhook data
  // keecashTransactionId: number;
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
  // Webhook data
  // keecashTransactionId: number;
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
