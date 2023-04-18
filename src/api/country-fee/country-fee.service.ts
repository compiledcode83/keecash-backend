import { Injectable } from '@nestjs/common';
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
    return this.cardPriceRepository.findOne({ where: param });
  }

  async findCardTopupFee(param: Partial<CardTopupFee>): Promise<CardTopupFee> {
    return this.cardTopupFeeRepository.findOne({ where: param });
  }

  async findOneWalletDepositWithdrawalFee(
    param: Partial<WalletDepositWithdrawalFee>,
  ): Promise<WalletDepositWithdrawalFee> {
    return this.walletDepositWithdrawalFeeRepository.findOne({ where: param });
  }

  async findOneTransferReferralCardWithdrawalFee(
    param: Partial<TransferReferralCardWithdrawalFee>,
  ): Promise<TransferReferralCardWithdrawalFee> {
    return this.transferReferralCardWithdrawalFeeRepository.findOne({ where: param });
  }

  async findOneCardTopupFee(param: Partial<CardTopupFee>): Promise<CardTopupFee> {
    return this.cardTopupFeeRepository.findOne({ where: param });
  }
}
