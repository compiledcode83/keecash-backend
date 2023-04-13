import { ApiProperty } from '@nestjs/swagger';
import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@api/crypto-tx/crypto-tx.types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wallet_deposit_withdrawal_fee')
export class WalletDepositWithdrawalFee {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Country Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: true })
  countryId: number;

  @ApiProperty({ example: 'EUR', description: 'Wallet currency' })
  @Column({ type: 'enum', enum: FiatCurrencyEnum, default: FiatCurrencyEnum.EUR })
  currency: FiatCurrencyEnum;

  @ApiProperty({ description: 'Transaction method', maximum: 255, required: true })
  @Column({ type: 'enum', enum: CryptoCurrencyEnum })
  method: CryptoCurrencyEnum;

  // --------------------- DEPOSIT -------------------------

  @ApiProperty({ description: 'deposit fixed fee', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  depositFixedFee: number;

  @ApiProperty({ description: 'deposit percent fee', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  depositPercentFee: number;

  @ApiProperty({ description: 'deposit min amount', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  depositMinAmount: number;

  @ApiProperty({ description: 'deposit max amount', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  depositMaxAmount: number;

  // --------------------- WITHDRAWAL -------------------------

  @ApiProperty({ description: 'withdraw fixed fee', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  withdrawFixedFee: number;

  @ApiProperty({ description: 'withdraw percent fee', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  withdrawPercentFee: number;

  @ApiProperty({ description: 'withdraw min amount', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  withdrawMinAmount: number;

  @ApiProperty({ description: 'withdraw max amount', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  withdrawMaxAmount: number;
}
