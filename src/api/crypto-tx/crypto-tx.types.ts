export enum CryptoCurrencyEnum {
  BTC = 'BTC',
  LNBC = 'LNBC',
  ETH = 'ETH',
  ETH_ERC20 = 'ETH_ERC20',
  USDT_ERC20 = 'USDT_ERC20',
  USDT_TRC20 = 'USDT_TRC20',
  USDC_ERC20 = 'USDC_ERC20',
}

export enum FiatCurrencyEnum {
  USD = 'USD',
  EUR = 'EUR',
}

export enum TxTypeEnum {
  Deposit = 'DEPOSIT',
  Withdrawal = 'WITHDRAWAL',
  Transfer = 'TRANSFER',
  CardCreateFee = 'CARD_CREATE_FEE', // $10.00
  CardTopup = 'CARD_TOPUP',
  CardTopupFee = 'CARD_TOPUP_FEE', // 1.5% + $0.99
  CardWithdrawal = 'CARD_WITHDRAWAL',
  CardWithdrawalFee = 'CARD_WITHDRAWAL_FEE', // 1.5% + $0.99
}
