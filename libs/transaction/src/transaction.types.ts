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
