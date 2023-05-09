import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FiatCurrencyEnum } from '@app/transaction/transaction.types';

@Entity('transfer_fee')
export class TransferFee {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Country Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  countryId: number;

  @ApiProperty({ example: 'EUR', description: 'Currency' })
  @Column({ type: 'enum', enum: FiatCurrencyEnum, default: FiatCurrencyEnum.EUR })
  currency: FiatCurrencyEnum;

  @ApiProperty({ description: 'transfer fixed fee', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  fixedFee: number;

  @ApiProperty({ description: 'transfer percent fee', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  percentFee: number;

  @ApiProperty({ description: 'transfer min amount', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  minAmount: number;

  @ApiProperty({ description: 'transfer max amount', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false, default: 0 })
  maxAmount: number;
}
