export enum TransactionStatusEnum {
  InProgress = 'IN_PROGRESS',
  Performed = 'PERFORMED',
  Rejected = 'REJECTED',
  Refunded = 'REFUNDED',
}

export enum ExternalTxMethodEnum {
  BTC = 'BTC',
  USDT_TRC20 = 'USDT_TRC20',
  ETH = 'ETH',
  USDT_ERC20 = 'USDT_ERC20',
  BANK_CARD = 'BANK_CARD',
  WIRE = 'WIRE',
}
