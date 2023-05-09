import { ApiProperty } from '@nestjs/swagger';
import { FiatCurrencyEnum } from 'libs/transaction/src/transaction.types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('referral_fee')
export class ReferralFee {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Country Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  countryId: number;

  @ApiProperty({ example: 'EUR', description: 'Currency' })
  @Column({ type: 'enum', enum: FiatCurrencyEnum, default: FiatCurrencyEnum.EUR })
  currency: FiatCurrencyEnum;

  @ApiProperty({ description: 'referral fixed fee', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  fixedFee: number;

  @ApiProperty({ description: 'referral percentage fee', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  percentFee: number;
}
