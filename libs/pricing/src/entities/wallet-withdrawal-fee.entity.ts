import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@app/common';

@Entity('wallet_withdrawal_fee')
export class WalletWithdrawalFee {
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

  @ApiProperty({ description: 'withdrawal fixed fee', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  fixedFee: number;

  @ApiProperty({ description: 'withdrawal percent fee', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  percentFee: number;

  @ApiProperty({ description: 'withdrawal min amount', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  minAmount: number;

  @ApiProperty({ description: 'withdrawal max amount', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  maxAmount: number;
}
