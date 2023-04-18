import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CardPrice } from './card-price.entity';
import { CardTopupFee } from './card-topup-fee.entity';
import { TransferReferralCardWithdrawalFee } from './transfer-referral-card-withdrawal-fee.entity';
import { WalletDepositWithdrawalFee } from './wallet-deposit-withdrawal-fee.entity';

@Injectable()
export class CardPriceRepository extends Repository<CardPrice> {
  constructor(private readonly dataSource: DataSource) {
    super(CardPrice, dataSource.manager);
  }
}

@Injectable()
export class CardTopupFeeRepository extends Repository<CardTopupFee> {
  constructor(private readonly dataSource: DataSource) {
    super(CardTopupFee, dataSource.manager);
  }
}

@Injectable()
export class TransferReferralCardWithdrawalFeeRepository extends Repository<TransferReferralCardWithdrawalFee> {
  constructor(private readonly dataSource: DataSource) {
    super(TransferReferralCardWithdrawalFee, dataSource.manager);
  }
}

@Injectable()
export class WalletDepositWithdrawalFeeRepository extends Repository<WalletDepositWithdrawalFee> {
  constructor(private readonly dataSource: DataSource) {
    super(WalletDepositWithdrawalFee, dataSource.manager);
  }
}
