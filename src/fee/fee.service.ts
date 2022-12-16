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
    return fee;
  }

  async getCryptoDepostiFeeFixed(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .select('value')
      .where({ name: 'crypto_deposit_fee_fixed' })
      .getRawOne();
    return fee;
  }

  async getCryptoWithdrawFeePercent(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .select('value')
      .where({ name: 'crypto_withdraw_fee_percent' })
      .getRawOne();
    return fee;
  }

  async getCryptoWithdrawFeeFixed(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .select('value')
      .where({ name: 'crypto_withdraw_fee_fixed' })
      .getRawOne();
    return fee;
  }

  async getCryptoTransferFeePercent(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .select('value')
      .where({ name: 'crypto_transfer_fee_percent' })
      .getRawOne();
    return fee;
  }

  async getCryptoTransferFeeFixed(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .select('value')
      .where({ name: 'crypto_transfer_fee_fixed' })
      .getRawOne();
    return fee;
  }

  async getCryptoDepositReferralFeePercent(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .select('value')
      .where({ name: 'crypto_deposit_referral_fee_percent' })
      .getRawOne();
    return fee;
  }

  async getCryptoWithdrawReferralFeePercent(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .select('value')
      .where({ name: 'crypto_withdraw_referral_fee_percent' })
      .getRawOne();
    return fee;
  }

  async getCryptoTransferReferralFeePercent(): Promise<number> {
    const fee = await this.feeRepository
      .createQueryBuilder('fee')
      .select('value')
      .where({ name: 'crypto_transfer_referral_fee_percent' })
      .getRawOne();
    return fee;
  }
}
