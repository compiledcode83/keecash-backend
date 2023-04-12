import { ApiProperty } from '@nestjs/swagger';
import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@api/crypto-tx/crypto-tx.types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('card_topup_fee')
export class CardTopupFee {
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

  // --------------------- CARD TOP UP -------------------------

  @ApiProperty({ description: 'card top up fixed fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  cardTopUpFixedFee: number;

  @ApiProperty({ description: 'card top up percent fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  cardTopUpPercentFee: number;

  @ApiProperty({ description: 'card top up min amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  cardTopUpMinAmount: number;

  @ApiProperty({ description: 'card top up max amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  cardTopUpMaxAmount: number;
}
