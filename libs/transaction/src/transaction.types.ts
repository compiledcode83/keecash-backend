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
  WalletDeposit = 'transaction.wallet.deposit',
  WalletWithdrawal = 'transaction.wallet.withdrawal',
  WalletTransfer = 'transaction.wallet.transfer',
  CardCreation = 'transaction.card.creation',
  CardTopup = 'transaction.card.topup',
  CardWithdrawal = 'transaction.card.withdrawal',
  ReferralFee = 'transaction.referral.fee',
}
