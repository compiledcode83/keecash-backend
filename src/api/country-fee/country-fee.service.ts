import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CardPriceRepository,
  CardTopupFeeRepository,
  TransferReferralCardWithdrawalFeeRepository,
  WalletDepositWithdrawalFeeRepository,
} from './country-fee.repository';
import { CardPrice } from './card-price.entity';
import { CardTopupFee } from './card-topup-fee.entity';
import { WalletDepositWithdrawalFee } from './wallet-deposit-withdrawal-fee.entity';
import { TransferReferralCardWithdrawalFee } from './transfer-referral-card-withdrawal-fee.entity';

@Injectable()
export class CountryFeeService {
  constructor(
    private readonly cardPriceRepository: CardPriceRepository,
    private readonly cardTopupFeeRepository: CardTopupFeeRepository,
    private readonly transferReferralCardWithdrawalFeeRepository: TransferReferralCardWithdrawalFeeRepository,
    private readonly walletDepositWithdrawalFeeRepository: WalletDepositWithdrawalFeeRepository,
  ) {}

  async findCardPrices(param: Partial<CardPrice>): Promise<CardPrice[]> {
    return this.cardPriceRepository.find({ where: param });
  }

  async findOneCardPrice(param: Partial<CardPrice>): Promise<CardPrice> {
    const cardPrice = await this.cardPriceRepository.findOne({ where: param });

    if (!cardPrice) {
      throw new NotFoundException(`Cannot find card price data for request`);
    }

    return cardPrice;
  }

  async findOneCardTopupFee(param: Partial<CardTopupFee>): Promise<CardTopupFee> {
    const cardTopupFee = await this.cardTopupFeeRepository.findOne({ where: param });

    if (!cardTopupFee) {
      throw new NotFoundException(`Cannot find card topup fee data for request`);
    }

    return cardTopupFee;
  }

  async findOneWalletDepositWithdrawalFee(
    param: Partial<WalletDepositWithdrawalFee>,
  ): Promise<WalletDepositWithdrawalFee> {
    const walletFee = await this.walletDepositWithdrawalFeeRepository.findOne({ where: param });

    if (!walletFee) {
      throw new NotFoundException(`Cannot find wallet fee data for request`);
    }

    return walletFee;
  }

  async findOneTransferReferralCardWithdrawalFee(
    param: Partial<TransferReferralCardWithdrawalFee>,
  ): Promise<TransferReferralCardWithdrawalFee> {
    const fee = await this.transferReferralCardWithdrawalFeeRepository.findOne({ where: param });

    if (!fee) {
      throw new NotFoundException(`Cannot find fee data for request`);
    }

    return fee;
  }

  async findManyTransferReferralCardWithdrawalFee(
    param: Partial<TransferReferralCardWithdrawalFee>,
  ): Promise<TransferReferralCardWithdrawalFee[]> {
    const fee = await this.transferReferralCardWithdrawalFeeRepository.find({ where: param });

    if (!fee) {
      throw new NotFoundException(`Cannot find fee data for request`);
    }

    return fee;
  }
}
