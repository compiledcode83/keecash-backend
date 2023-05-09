export enum TransactionTypeEnum {
  Deposit = 'DEPOSIT',
  Withdrawal = 'WITHDRAWAL',
  Transfer = 'TRANSFER',
  CardCreation = 'CARD_CREATION',
  CardTopup = 'CARD_TOPUP',
  CardWithdrawal = 'CARD_WITHDRAWAL',
  ReferralFee = 'REFERRAL_FEE',
}

export enum TransactionStatusEnum {
  InProgress = 'IN_PROGRESS',
  Performed = 'PERFORMED',
  Rejected = 'REJECTED',
  Refunded = 'REFUNDED',
}

export enum CryptoCurrencyEnum {
  BTC = 'BTC',
  LBTC = 'LBTC',
  ETH = 'ETH',
  USDT_ERC20 = 'USDT',
  USDT_TRC20 = 'USDT_TRC20',
  USDC_ERC20 = 'USDC',
  USDC_TRC20 = 'USDC_TRC20',
}

export enum FiatCurrencyEnum {
  USD = 'USD',
  EUR = 'EUR',
}
