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

export enum TransactionEventPattern {
  WalletDeposit = 'wallet.deposit',
  WalletWithdrawal = 'wallet.withdrawal',
  WalletTransfer = 'wallet.transfer',
  CardCreation = 'card.creation',
  CardTopup = 'card.topup',
  CardWithdrawal = 'card.withdrawal',
  ReferralFee = 'referral.fee',
}
