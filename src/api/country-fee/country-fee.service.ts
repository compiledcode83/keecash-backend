import { Injectable } from '@nestjs/common';
import { FiatCurrencyEnum } from '@api/crypto-tx/crypto-tx.types';
import {
  CardPriceRepository,
  CardTopupFeeRepository,
  TransferReferralCardWithdrawalFeeRepository,
  WalletDepositWithdrawalFeeRepository,
} from './country-fee.repository';
import { CardPrice } from './card-price.entity';
import { CardTopupFee } from './card-topup-fee.entity';

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

  // async findMany(param: any) {
  //   return this.countryFeeRepository.find(param);
  // }

  // async getCryptoDepostiFeePercent(): Promise<number> {
  //   const fee = await this.countryFeeRepository
  //     .createQueryBuilder('fee')
  //     .select('value')
  //     .where({ name: 'crypto_deposit_fee_percent' })
  //     .getRawOne();

  //   return fee.value;
  // }

  // async getCryptoDepostiFeeFixed(): Promise<number> {
  //   const fee = await this.countryFeeRepository
  //     .createQueryBuilder('fee')
  //     .select('value')
  //     .where({ name: 'crypto_deposit_fee_fixed' })
  //     .getRawOne();

  //   return fee.value;
  // }

  // async getCryptoWithdrawFeePercent(): Promise<number> {
  //   const fee = await this.countryFeeRepository
  //     .createQueryBuilder('fee')
  //     .select('value')
  //     .where({ name: 'crypto_withdraw_fee_percent' })
  //     .getRawOne();

  //   return fee.value;
  // }

  // async getCryptoWithdrawFeeFixed(): Promise<number> {
  //   const fee = await this.countryFeeRepository
  //     .createQueryBuilder('fee')
  //     .select('value')
  //     .where({ name: 'crypto_withdraw_fee_fixed' })
  //     .getRawOne();

  //   return fee.value;
  // }

  // async getCryptoTransferFeePercent(): Promise<number> {
  //   const fee = await this.countryFeeRepository
  //     .createQueryBuilder('fee')
  //     .select('value')
  //     .where({ name: 'crypto_transfer_fee_percent' })
  //     .getRawOne();

  //   return fee.value;
  // }

  // async getCryptoTransferFeeFixed(): Promise<number> {
  //   const fee = await this.countryFeeRepository
  //     .createQueryBuilder('fee')
  //     .select('value')
  //     .where({ name: 'crypto_transfer_fee_fixed' })
  //     .getRawOne();

  //   return fee.value;
  // }

  // async getCryptoDepositReferralFeePercent(): Promise<number> {
  //   const fee = await this.countryFeeRepository
  //     .createQueryBuilder('fee')
  //     .select('value')
  //     .where({ name: 'crypto_deposit_referral_fee_percent' })
  //     .getRawOne();

  //   return fee.value;
  // }

  // async getCryptoWithdrawReferralFeePercent(): Promise<number> {
  //   const fee = await this.countryFeeRepository
  //     .createQueryBuilder('fee')
  //     .select('value')
  //     .where({ name: 'crypto_withdarw_referral_fee_percent' })
  //     .getRawOne();

  //   return fee.value;
  // }

  // async getCryptoTransferReferralFeePercent(): Promise<number> {
  //   const fee = await this.countryFeeRepository
  //     .createQueryBuilder('fee')
  //     .select('value')
  //     .where({ name: 'crypto_transfer_referral_fee_percent' })
  //     .getRawOne();

  //   return fee.value;
  // }

  // async getDepositFixedFee(countryId: number, currencyName: FiatCurrencyEnum): Promise<number> {
  //   return this.countryFeeRepository.getDepositFixedFee(countryId, currencyName);
  // }

  // async getDepositPercentFee(countryId: number, currencyName: FiatCurrencyEnum): Promise<number> {
  //   return this.countryFeeRepository.getDepositPercentFee(countryId, currencyName);
  // }

  // async getDepositMinAmount(countryId: number, currencyName: FiatCurrencyEnum): Promise<number> {
  //   return this.countryFeeRepository.getDepositMinAmount(countryId, currencyName);
  // }

  // async getDepositMaxAmount(countryId: number, currencyName: FiatCurrencyEnum): Promise<number> {
  //   return this.countryFeeRepository.getDepositMaxAmount(countryId, currencyName);
  // }

  // async getWithdrawFixedFee(countryId: number, currencyName: FiatCurrencyEnum): Promise<number> {
  //   return this.countryFeeRepository.getWithdrawFixedFee(countryId, currencyName);
  // }

  // async getWithdrawPercentFee(countryId: number, currencyName: FiatCurrencyEnum): Promise<number> {
  //   return this.countryFeeRepository.getWithdrawPercentFee(countryId, currencyName);
  // }

  // async getWithdrawMinAmount(countryId: number, currencyName: FiatCurrencyEnum): Promise<number> {
  //   return this.countryFeeRepository.getWithdrawMinAmount(countryId, currencyName);
  // }

  // async getWithdrawMaxAmount(countryId: number, currencyName: FiatCurrencyEnum): Promise<number> {
  //   return this.countryFeeRepository.getWithdrawMaxAmount(countryId, currencyName);
  // }

  // async getTransferFixedFee(countryId: number, currencyName: FiatCurrencyEnum): Promise<number> {
  //   return this.countryFeeRepository.getTransferFixedFee(countryId, currencyName);
  // }

  // async getTransferPercentFee(countryId: number, currencyName: FiatCurrencyEnum): Promise<number> {
  //   return this.countryFeeRepository.getTransferPercentFee(countryId, currencyName);
  // }

  // async getTransferMinAmount(countryId: number, currencyName: FiatCurrencyEnum): Promise<number> {
  //   return this.countryFeeRepository.getTransferMinAmount(countryId, currencyName);
  // }

  // async getTransferMaxAmount(countryId: number, currencyName: FiatCurrencyEnum): Promise<number> {
  //   return this.countryFeeRepository.getTransferMaxAmount(countryId, currencyName);
  // }
}
