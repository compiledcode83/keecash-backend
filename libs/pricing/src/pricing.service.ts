import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardPrice } from './entities/card-price.entity';
import { Repository } from 'typeorm';
import { CardTopupFee } from './entities/card-topup-fee.entity';
import { CardWithdrawalFee } from './entities/card-withdrawal-fee.entity';
import { ReferralFee } from './entities/referral-fee.entity';
import { TransferFee } from './entities/transfer-fee.entity';
import { WalletDepositFee } from './entities/wallet-deposit-fee.entity';
import { WalletWithdrawalFee } from './entities/wallet-withdrawal-fee.entity';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(CardPrice)
    private cardPriceRepository: Repository<CardPrice>,
    @InjectRepository(CardTopupFee)
    private cardTopupFeeRepository: Repository<CardTopupFee>,
    @InjectRepository(CardWithdrawalFee)
    private cardWithdrawalRepository: Repository<CardWithdrawalFee>,
    @InjectRepository(ReferralFee)
    private referralFeeRepository: Repository<ReferralFee>,
    @InjectRepository(TransferFee)
    private transferRepository: Repository<TransferFee>,
    @InjectRepository(WalletDepositFee)
    private walletDepositRepository: Repository<WalletDepositFee>,
    @InjectRepository(WalletWithdrawalFee)
    private walletWithdrawalRepository: Repository<WalletWithdrawalFee>,
  ) {}
}
