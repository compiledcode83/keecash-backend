export enum TransactionStatusEnum {
  InProgress = 'IN_PROGRESS',
  Performed = 'PERFORMED',
  Rejected = 'REJECTED',
  Refunded = 'REFUNDED',
}

export enum CryptoCurrencyEnum {
  BTC = 'BTC',
  BTC_LIGHTNING = 'BTC_LIGHTNING',
  LBTC = 'LBTC',
  ETH = 'ETH',
  USDT_ERC20 = 'USDT_ERC20',
  USDT_TRC20 = 'USDT_TRC20',
  USDC = 'USDC',
  BINANCE = 'BINANCE',
}

export enum FiatCurrencyEnum {
  USD = 'USD',
  EUR = 'EUR',
}

export enum TxTypeEnum {
  Deposit = 'DEPOSIT',
  Withdrawal = 'WITHDRAWAL',
  Transfer = 'TRANSFER',
  CardCreation = 'CARD_CREATION',
  CardTopup = 'CARD_TOPUP',
  CardWithdrawal = 'CARD_WITHDRAWAL',
  ReferralFee = 'REFERRAL_FEE',
}
