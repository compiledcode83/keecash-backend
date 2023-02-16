import { Injectable } from '@nestjs/common';
import { FIAT_CURRENCY_NAME } from '@src/crypto-tx/crypto-tx.entity';
import { DataSource, Repository } from 'typeorm';
import { Fee } from './fee.entity';

@Injectable()
export class FeeRepository extends Repository<Fee> {
  constructor(private readonly dataSource: DataSource) {
    super(Fee, dataSource.manager);
  }

  async getDepositFixedFee(countryId: number, currencyName: FIAT_CURRENCY_NAME): Promise<number> {
    const fee = await this.createQueryBuilder('deposit_fee')
      .select('deposit_fixed_fee')
      .where({ countryId: countryId })
      .andWhere({ currencyName: currencyName })
      .getRawOne();
    return fee.deposit_fixed_fee;
  }

  async getDepositPercentFee(countryId: number, currencyName: FIAT_CURRENCY_NAME): Promise<number> {
    const fee = await this.createQueryBuilder('deposit_fee')
      .select('deposit_percent_fee')
      .where({ countryId: countryId })
      .andWhere({ currencyName: currencyName })
      .getRawOne();
    return fee.deposit_percent_fee;
  }

  async getDepositMinAmount(countryId: number, currencyName: FIAT_CURRENCY_NAME): Promise<number> {
    const fee = await this.createQueryBuilder('deposit_fee')
      .select('deposit_min_amount')
      .where({ countryId: countryId })
      .andWhere({ currencyName: currencyName })
      .getRawOne();
    return fee.deposit_min_amount;
  }

  async getDepositMaxAmount(countryId: number, currencyName: FIAT_CURRENCY_NAME): Promise<number> {
    const fee = await this.createQueryBuilder('deposit_fee')
      .select('deposit_max_amount')
      .where({ countryId: countryId })
      .andWhere({ currencyName: currencyName })
      .getRawOne();
    return fee.deposit_max_amount;
  }

  async getWithdrawFixedFee(countryId: number, currencyName: FIAT_CURRENCY_NAME): Promise<number> {
    const fee = await this.createQueryBuilder('deposit_fee')
      .select('withdraw_fixed_fee')
      .where({ countryId: countryId })
      .andWhere({ currencyName: currencyName })
      .getRawOne();
    return fee.withdraw_fixed_fee;
  }

  async getWithdrawPercentFee(
    countryId: number,
    currencyName: FIAT_CURRENCY_NAME,
  ): Promise<number> {
    const fee = await this.createQueryBuilder('deposit_fee')
      .select('withdraw_percent_fee')
      .where({ countryId: countryId })
      .andWhere({ currencyName: currencyName })
      .getRawOne();
    return fee.withdraw_percent_fee;
  }

  async getWithdrawMinAmount(countryId: number, currencyName: FIAT_CURRENCY_NAME): Promise<number> {
    const fee = await this.createQueryBuilder('deposit_fee')
      .select('withdraw_min_amount')
      .where({ countryId: countryId })
      .andWhere({ currencyName: currencyName })
      .getRawOne();
    return fee.withdraw_min_amount;
  }

  async getWithdrawMaxAmount(countryId: number, currencyName: FIAT_CURRENCY_NAME): Promise<number> {
    const fee = await this.createQueryBuilder('deposit_fee')
      .select('withdraw_max_amount')
      .where({ countryId: countryId })
      .andWhere({ currencyName: currencyName })
      .getRawOne();
    return fee.withdraw_max_amount;
  }

  async getTransferFixedFee(countryId: number, currencyName: FIAT_CURRENCY_NAME): Promise<number> {
    const fee = await this.createQueryBuilder('deposit_fee')
      .select('transfer_fixed_fee')
      .where({ countryId: countryId })
      .andWhere({ currencyName: currencyName })
      .getRawOne();
    return fee.transfer_fixed_fee;
  }

  async getTransferPercentFee(
    countryId: number,
    currencyName: FIAT_CURRENCY_NAME,
  ): Promise<number> {
    const fee = await this.createQueryBuilder('deposit_fee')
      .select('transfer_percent_fee')
      .where({ countryId: countryId })
      .andWhere({ currencyName: currencyName })
      .getRawOne();
    return fee.transfer_percent_fee;
  }

  async getTransferMinAmount(countryId: number, currencyName: FIAT_CURRENCY_NAME): Promise<number> {
    const fee = await this.createQueryBuilder('deposit_fee')
      .select('transfer_min_amount')
      .where({ countryId: countryId })
      .andWhere({ currencyName: currencyName })
      .getRawOne();
    return fee.transfer_min_amount;
  }

  async getTransferMaxAmount(countryId: number, currencyName: FIAT_CURRENCY_NAME): Promise<number> {
    const fee = await this.createQueryBuilder('deposit_fee')
      .select('transfer_max_amount')
      .where({ countryId: countryId })
      .andWhere({ currencyName: currencyName })
      .getRawOne();
    return fee.transfer_max_amount;
  }
}
