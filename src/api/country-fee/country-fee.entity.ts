import { ApiProperty } from '@nestjs/swagger';
import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@api/crypto-tx/crypto-tx.types';
import { Country } from '@api/country/country.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('country_fee')
export class CountryFee {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Wallet currency', maximum: 255, required: true })
  @Column({ type: 'enum', enum: FiatCurrencyEnum, default: FiatCurrencyEnum.EUR })
  walletCurrency: FiatCurrencyEnum;

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

  // --------------------- TRANSFER -------------------------

  @ApiProperty({ description: 'transfer fixed fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  transferFixedFee: number;

  @ApiProperty({ description: 'transfer percent fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  transferPercentFee: number;

  @ApiProperty({ description: 'transfer min amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  transferMinAmount: number;

  @ApiProperty({ description: 'transfer max amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  transferMaxAmount: number;

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

  // --------------------- CARD WITHDRAWAL -------------------------

  @ApiProperty({ description: 'card withdraw fixed fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  cardWithdrawFixedFee: number;

  @ApiProperty({ description: 'card withdraw percent fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  cardWithdrawPercentFee: number;

  @ApiProperty({ description: 'card withdraw min amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  cardWithdrawMinAmount: number;

  @ApiProperty({ description: 'card withdraw max amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  cardWithdrawMaxAmount: number;

  // ------------------------- CARD PRICE ----------------------------

  @ApiProperty({ description: 'card price', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  cardPrice: number;

  // ------------------------ REFERRAL FEE ---------------------------

  @ApiProperty({ description: 'referral fixed fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  referralFixedFee: number;

  @ApiProperty({ description: 'referral percentage fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  referralPercentageFee: number;

  // ----------------------------------------------------------------

  @OneToOne(() => Country, (country) => country.fee)
  @JoinColumn()
  country: Country;
}
