import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FiatCurrencyEnum } from '@app/transaction/transaction.types';

@Entity('card_withdrawal_fee')
export class CardWithdrawalFee {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Country Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  countryId: number;

  @ApiProperty({ example: 'EUR', description: 'Currency' })
  @Column({ type: 'enum', enum: FiatCurrencyEnum, default: FiatCurrencyEnum.EUR })
  currency: FiatCurrencyEnum;

  @ApiProperty({ description: 'card withdrawal fixed fee', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  fixedFee: number;

  @ApiProperty({ description: 'card withdrawal percentage fee', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  percentFee: number;

  @ApiProperty({ description: 'card withdrawal min amount', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  minAmount: number;

  @ApiProperty({ description: 'card withdrawal max amount', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  maxAmount: number;
}
