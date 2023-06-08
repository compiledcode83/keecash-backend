export enum NotificationType {
  Deposit = 'DEPOSIT',
  Withdrawal = 'WITHDRAWAL',
  TransferSent = 'TRANSFER_SENT',
  TransferReceived = 'TRANSFER_RECEIVED',
  CardTopup = 'CARD_TOPUP',
  CardWithdrawal = 'CARD_WITHDRAWAL',
  Other = 'OTHER',
}

export enum NotificationCurrencyType {
  USD = 'USD',
  EUR = 'EUR',
  BTC = 'BTC',
  ETH = 'ETH',
}
