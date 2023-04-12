import { ApiProperty } from '@nestjs/swagger';
import { FiatCurrencyEnum } from '@api/crypto-tx/crypto-tx.types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transfer_referral_card_withdrawal_fee')
export class TransferReferralCardWithdrawalFee {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Country Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: true })
  countryId: number;

  @ApiProperty({ example: 'EUR', description: 'Currency' })
  @Column({ type: 'enum', enum: FiatCurrencyEnum, default: FiatCurrencyEnum.EUR })
  currency: FiatCurrencyEnum;

  // --------------------- TRANSFER -------------------------

  @ApiProperty({ description: 'transfer fixed fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  transferFixedFee: number;

  @ApiProperty({ description: 'transfer percent fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  transferPercentFee: number;

  @ApiProperty({ description: 'transfer min amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  transferMinAmount: number;

  @ApiProperty({ description: 'transfer max amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  transferMaxAmount: number;

  // ------------------------ REFERRAL FEE ---------------------------

  @ApiProperty({ description: 'referral fixed fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  referralFixedFee: number;

  @ApiProperty({ description: 'referral percentage fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  referralPercentageFee: number;

  // --------------------- CARD WITHDRAWAL -------------------------

  @ApiProperty({ description: 'card withdraw fixed fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  cardWithdrawFixedFee: number;

  @ApiProperty({ description: 'card withdraw percent fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  cardWithdrawPercentFee: number;

  @ApiProperty({ description: 'card withdraw min amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  cardWithdrawMinAmount: number;

  @ApiProperty({ description: 'card withdraw max amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  cardWithdrawMaxAmount: number;
}
