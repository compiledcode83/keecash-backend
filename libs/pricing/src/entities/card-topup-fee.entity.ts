import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FiatCurrencyEnum } from '@app/common';
import { CardUsageEnum } from '@app/card';

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

  @ApiProperty({ description: 'card top up fixed fee', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  fixedFee: number;

  @ApiProperty({ description: 'card top up percent fee', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  percentFee: number;

  @ApiProperty({ description: 'card top up min amount', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  minAmount: number;

  @ApiProperty({ description: 'card top up max amount', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  maxAmount: number;
}
