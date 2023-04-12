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

  @ApiProperty({ description: 'deposit fixed fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  depositFixedFee: number;

  @ApiProperty({ description: 'deposit percent fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  depositPercentFee: number;

  @ApiProperty({ description: 'deposit min amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  depositMinAmount: number;

  @ApiProperty({ description: 'deposit max amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  depositMaxAmount: number;

  // --------------------- WITHDRAWAL -------------------------

  @ApiProperty({ description: 'withdraw fixed fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  withdrawFixedFee: number;

  @ApiProperty({ description: 'withdraw percent fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  withdrawPercentFee: number;

  @ApiProperty({ description: 'withdraw min amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  withdrawMinAmount: number;

  @ApiProperty({ description: 'withdraw max amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  withdrawMaxAmount: number;
}
