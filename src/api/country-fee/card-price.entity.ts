import { ApiProperty } from '@nestjs/swagger';
import { FiatCurrencyEnum } from '@api/crypto-tx/crypto-tx.types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CardTypeEnum, CardUsageEnum } from '../card/card.types';

@Entity('card_price')
export class CardPrice {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Country Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: true })
  countryId: number;

  @ApiProperty({ example: 'EUR', description: 'Currency' })
  @Column({ type: 'enum', enum: FiatCurrencyEnum, default: FiatCurrencyEnum.EUR })
  currency: FiatCurrencyEnum;

  @ApiProperty({ description: 'Card usage type - UNIQUE or MULTIPLE' })
  @Column({ type: 'enum', enum: CardUsageEnum, default: CardUsageEnum.Unique })
  usage: CardUsageEnum;

  @ApiProperty({ description: 'Card type - virtual or physical' })
  @Column({ type: 'enum', enum: CardTypeEnum, default: CardTypeEnum.Virtual })
  type: CardTypeEnum;

  // --------------------- CARD PRICE -------------------------

  @ApiProperty({ description: 'card price', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  cardPrice: number;
}
