import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FiatCurrencyEnum } from '@app/transaction/transaction.types';
import { CardTypeEnum, CardUsageEnum } from '@app/card/card.types';

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

  @ApiProperty({ description: 'card price', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  price: number;
}
