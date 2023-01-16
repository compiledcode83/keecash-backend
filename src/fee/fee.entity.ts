import { ApiProperty } from '@nestjs/swagger';
import { FIAT_CURRENCY_NAME } from '@src/crypto-tx/crypto-tx.entity';
import { Country } from '@src/user/table/country.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('fee')
export class Fee {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'country id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  countryId: number;

  @ApiProperty({
    description: 'Crypto currency name',
    maximum: 255,
    required: true,
  })
  @Column({
    type: 'enum',
    enum: FIAT_CURRENCY_NAME,
    default: FIAT_CURRENCY_NAME.EUR,
  })
  currencyName: FIAT_CURRENCY_NAME;

  @ApiProperty({
    description: 'deposit fixed fee ',
    maximum: 64,
    required: true,
  })
  @Column({ type: 'float', nullable: false })
  depositFixedFee: number;

  @ApiProperty({
    description: 'deposit percent fee ',
    maximum: 64,
    required: true,
  })
  @Column({ type: 'float', nullable: false })
  depositPercentFee: number;

  @ApiProperty({
    description: 'deposit min amount ',
    maximum: 64,
    required: true,
  })
  @Column({ type: 'float', nullable: false })
  depositMinAmount: number;

  @ApiProperty({
    description: 'deposit max amount ',
    maximum: 64,
    required: true,
  })
  @Column({ type: 'float', nullable: false })
  depositMaxAmount: number;

  @ApiProperty({
    description: 'withdraw fixed fee ',
    maximum: 64,
    required: true,
  })
  @Column({ type: 'float', nullable: false })
  withdrawFixedFee: number;

  @ApiProperty({
    description: 'withdraw percent fee ',
    maximum: 64,
    required: true,
  })
  @Column({ type: 'float', nullable: false })
  withdrawPercentFee: number;

  @ApiProperty({
    description: 'withdraw min amount ',
    maximum: 64,
    required: true,
  })
  @Column({ type: 'float', nullable: false })
  withdrawMinAmount: number;

  @ApiProperty({
    description: 'withdraw max amount ',
    maximum: 64,
    required: true,
  })
  @Column({ type: 'float', nullable: false })
  withdrawMaxAmount: number;

  @ApiProperty({
    description: 'transfer fixed fee ',
    maximum: 64,
    required: true,
  })
  @Column({ type: 'float', nullable: false })
  transferFixedFee: number;

  @ApiProperty({
    description: 'transfer percent fee ',
    maximum: 64,
    required: true,
  })
  @Column({ type: 'float', nullable: false })
  transferPercentFee: number;

  @ApiProperty({
    description: 'transfer min amount ',
    maximum: 64,
    required: true,
  })
  @Column({ type: 'float', nullable: false })
  transferMinAmount: number;

  @ApiProperty({
    description: 'transfer max amount ',
    maximum: 64,
    required: true,
  })
  @Column({ type: 'float', nullable: false })
  transferMaxAmount: number;

  @ManyToOne(() => Country, (country) => country.fee)
  country: Country;
}
