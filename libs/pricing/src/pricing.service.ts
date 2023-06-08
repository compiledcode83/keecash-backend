import { Injectable, NotFoundException } from '@nestjs/common';
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
    private cardWithdrawalFeeRepository: Repository<CardWithdrawalFee>,
    @InjectRepository(ReferralFee)
    private referralFeeRepository: Repository<ReferralFee>,
    @InjectRepository(TransferFee)
    private transferFeeRepository: Repository<TransferFee>,
    @InjectRepository(WalletDepositFee)
    private walletDepositFeeRepository: Repository<WalletDepositFee>,
    @InjectRepository(WalletWithdrawalFee)
    private walletWithdrawalFeeRepository: Repository<WalletWithdrawalFee>,
  ) {}

  async findAllCardPrices(param: Partial<CardPrice>): Promise<CardPrice[]> {
    return this.cardPriceRepository.find({ where: param });
  }

  async findOneCardPrice(param: Partial<CardPrice>): Promise<CardPrice> {
    const cardPrice = await this.cardPriceRepository.findOne({ where: param });

    if (!cardPrice) {
      throw new NotFoundException(`Cannot find card price data for request`);
    }

    return cardPrice;
  }

  async findCardTopupFee(param: Partial<CardTopupFee>): Promise<CardTopupFee> {
    const cardTopupFee = await this.cardTopupFeeRepository.findOne({ where: param });

    if (!cardTopupFee) {
      throw new NotFoundException(`Cannot find card topup fee data for request`);
    }

    return cardTopupFee;
  }

  async findCardWithdrawalFee(param: Partial<CardWithdrawalFee>) {
    const cardWithdrawalFee = await this.cardWithdrawalFeeRepository.findOne({ where: param });

    if (!cardWithdrawalFee) {
      throw new NotFoundException(`Cannot find card withdrawal fee data for request`);
    }

    return cardWithdrawalFee;
  }

  async findWalletDepositFee(param: Partial<WalletDepositFee>) {
    const walletDepositFee = await this.walletDepositFeeRepository.findOne({ where: param });

    if (!walletDepositFee) {
      throw new NotFoundException(`Cannot find wallet deposit fee data for request`);
    }

    return walletDepositFee;
  }

  async findWalletWithdrawalFee(param: Partial<WalletWithdrawalFee>) {
    const walletWithdrawalFee = await this.walletWithdrawalFeeRepository.findOne({ where: param });

    if (!walletWithdrawalFee) {
      throw new NotFoundException(`Cannot find wallet withdrawal fee data for request`);
    }

    return walletWithdrawalFee;
  }

  async findTransferFee(param: Partial<TransferFee>) {
    const transferFee = await this.transferFeeRepository.findOne({ where: param });

    if (!transferFee) {
      throw new NotFoundException(`Cannot find transfer fee data for request`);
    }

    return transferFee;
  }

  async findReferralFee(param: Partial<ReferralFee>) {
    const referralFee = await this.referralFeeRepository.findOne({ where: param });

    if (!referralFee) {
      throw new NotFoundException(`Cannot find referral fee data for request`);
    }

    return referralFee;
  }
}
