import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';
import { CardUsageEnum } from '@api/card/card.types';

@Entity('card_topup_fee')
export class CardTopupFee {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Country Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  countryId: number;

  @ApiProperty({ example: 'EUR', description: 'Wallet currency' })
  @Column({ type: 'enum', enum: FiatCurrencyEnum, default: FiatCurrencyEnum.EUR })
  currency: FiatCurrencyEnum;

  @ApiProperty({ description: 'Card usage type - UNIQUE or MULTIPLE' })
  @Column({ type: 'enum', enum: CardUsageEnum, default: CardUsageEnum.Unique })
  usage: CardUsageEnum;

  // --------------------- CARD TOP UP -------------------------

  @ApiProperty({ description: 'card top up fixed fee', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  cardTopUpFixedFee: number;

  @ApiProperty({ description: 'card top up percent fee', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  cardTopUpPercentFee: number;

  @ApiProperty({ description: 'card top up min amount', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  cardTopUpMinAmount: number;

  @ApiProperty({ description: 'card top up max amount', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  cardTopUpMaxAmount: number;
}
