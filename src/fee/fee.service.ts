import { Injectable } from '@nestjs/common';
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
      .where({ name: 'crypto_withdraw_referral_fee_percent' })
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
}
