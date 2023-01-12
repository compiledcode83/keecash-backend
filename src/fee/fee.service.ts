import { Injectable } from '@nestjs/common';
import { FIAT_CURRENCY_NAME } from '@src/crypto-tx/crypto-tx.entity';
import { FeeRepository } from './fee.repository';

@Injectable()
export class FeeService {
  constructor(private readonly feeRepository: FeeRepository) {}

  async getCryptoDepostiFeePercent(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .select('value')
      .where({ name: 'crypto_deposit_fee_percent' })
      .getRawOne();
    return fee.value;
  }

  async getCryptoDepostiFeeFixed(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .select('value')
      .where({ name: 'crypto_deposit_fee_fixed' })
      .getRawOne();
    return fee.value;
  }

  async getCryptoWithdrawFeePercent(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .select('value')
      .where({ name: 'crypto_withdraw_fee_percent' })
      .getRawOne();
    return fee.value;
  }

  async getCryptoWithdrawFeeFixed(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .select('value')
      .where({ name: 'crypto_withdraw_fee_fixed' })
      .getRawOne();
    return fee.value;
  }

  async getCryptoTransferFeePercent(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .select('value')
      .where({ name: 'crypto_transfer_fee_percent' })
      .getRawOne();
    return fee.value;
  }

  async getCryptoTransferFeeFixed(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .select('value')
      .where({ name: 'crypto_transfer_fee_fixed' })
      .getRawOne();
    return fee.value;
  }

  async getCryptoDepositReferralFeePercent(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .select('value')
      .where({ name: 'crypto_deposit_referral_fee_percent' })
      .getRawOne();
    return fee.value;
  }

  async getCryptoWithdrawReferralFeePercent(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .select('value')
      .where({ name: 'crypto_withdarw_referral_fee_percent' })
      .getRawOne();
    return fee.value;
  }

  async getCryptoTransferReferralFeePercent(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .select('value')
      .where({ name: 'crypto_transfer_referral_fee_percent' })
      .getRawOne();
    return fee.value;
  }

  async getDepositFixedFee(
    countryId: number,
    currencyName: FIAT_CURRENCY_NAME,
  ): Promise<number> {
    return this.feeRepository.getDepositFixedFee(countryId, currencyName);
  }

  async getDepositPercentFee(
    countryId: number,
    currencyName: FIAT_CURRENCY_NAME,
  ): Promise<number> {
    return this.feeRepository.getDepositPercentFee(countryId, currencyName);
  }

  async getDepositMinAmount(
    countryId: number,
    currencyName: FIAT_CURRENCY_NAME,
  ): Promise<number> {
    return this.feeRepository.getDepositMinAmount(countryId, currencyName);
  }

  async getDepositMaxAmount(
    countryId: number,
    currencyName: FIAT_CURRENCY_NAME,
  ): Promise<number> {
    return this.feeRepository.getDepositMaxAmount(countryId, currencyName);
  }

  async getWithdrawFixedFee(
    countryId: number,
    currencyName: FIAT_CURRENCY_NAME,
  ): Promise<number> {
    return this.feeRepository.getWithdrawFixedFee(countryId, currencyName);
  }

  async getWithdrawPercentFee(
    countryId: number,
    currencyName: FIAT_CURRENCY_NAME,
  ): Promise<number> {
    return this.feeRepository.getWithdrawPercentFee(countryId, currencyName);
  }

  async getWithdrawMinAmount(
    countryId: number,
    currencyName: FIAT_CURRENCY_NAME,
  ): Promise<number> {
    return this.feeRepository.getWithdrawMinAmount(countryId, currencyName);
  }

  async getWithdrawMaxAmount(
    countryId: number,
    currencyName: FIAT_CURRENCY_NAME,
  ): Promise<number> {
    return this.feeRepository.getWithdrawMaxAmount(countryId, currencyName);
  }

  async getTransferFixedFee(
    countryId: number,
    currencyName: FIAT_CURRENCY_NAME,
  ): Promise<number> {
    return this.feeRepository.getTransferFixedFee(countryId, currencyName);
  }

  async getTransferPercentFee(
    countryId: number,
    currencyName: FIAT_CURRENCY_NAME,
  ): Promise<number> {
    return this.feeRepository.getTransferPercentFee(countryId, currencyName);
  }

  async getTransferMinAmount(
    countryId: number,
    currencyName: FIAT_CURRENCY_NAME,
  ): Promise<number> {
    return this.feeRepository.getTransferMinAmount(countryId, currencyName);
  }

  async getTransferMaxAmount(
    countryId: number,
    currencyName: FIAT_CURRENCY_NAME,
  ): Promise<number> {
    return this.feeRepository.getTransferMaxAmount(countryId, currencyName);
  }
}
