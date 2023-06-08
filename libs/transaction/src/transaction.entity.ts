import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@app/common';
import { Card } from '@app/card';
import { User } from '@app/user';
import { TransactionStatusEnum, TransactionTypeEnum } from './transaction.types';

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Unique uid', maximum: 36 })
  @Column({ type: 'varchar', nullable: false, length: 36 })
  uuid: string;

  @ApiProperty({ description: 'User ID', maximum: 64, required: false })
  @Column({ type: 'int', nullable: true })
  userId: number;

  @ApiProperty({ description: 'Sender ID', maximum: 64, required: false })
  @Column({ type: 'int', nullable: true })
  senderId: number;

  @ApiProperty({ description: 'Recevier ID', maximum: 64, required: false })
  @Column({ type: 'int', nullable: true })
  receiverId: number;

  // ----------------------------------------------------

  @ApiProperty({ description: 'Wallet currency: EUR or USD', required: true })
  @Column({ type: 'enum', enum: FiatCurrencyEnum, default: FiatCurrencyEnum.EUR })
  currency: FiatCurrencyEnum;

  // ----------------------------------------------------

  @ApiProperty({ description: 'Affected amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  affectedAmount: number; // DB query purpose - positive/negative available

  // ----------------------- Fee -----------------------

  @ApiProperty({ description: 'Applied fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true, default: 0 })
  appliedFee: number;

  @ApiProperty({ description: 'Fixed fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true, default: 0 })
  fixedFee: number;

  @ApiProperty({ description: 'Percentage fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true, default: 0 })
  percentFee: number;

  // ---------------- Crypto Transaction -----------------------

  @ApiProperty({
    description: `Transaction method (applied for TxType: DEPOSIT, WITHDRAWAL, otherwise NULL)`,
    required: false,
  })
  @Column({ type: 'enum', enum: CryptoCurrencyEnum, nullable: true })
  cryptoType: CryptoCurrencyEnum;

  @ApiProperty({ description: 'Crypto amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  cryptoAmount: number;

  @ApiProperty({
    description: 'Exchange rate (applied for exteneral transactions)',
    maximum: 64,
    required: false,
  })
  @Column({ type: 'float', nullable: true })
  exchangeRate: number;

  // ----------------------- Card -----------------------

  @ApiProperty({
    description: 'Card ID (Only applied for Card Transactions, otherwise NULL)',
    required: false,
  })
  @Column({ type: 'int', nullable: true })
  cardId: number;

  @ApiProperty({ description: 'Card price', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  cardPrice: number;

  // ----------------------------------------------------

  @ApiProperty({ example: 'SDF-453672-PMT', required: false })
  @Column({ type: 'varchar', nullable: true })
  tripleAPaymentReference: string;

  @ApiProperty({
    description:
      'Type of transaction: DEPOSIT | WITHDRAWAL | TRANSFER | CARD_CREATION | CARD_TOPUP | CARD_WITHDRAWAL',
    required: true,
  })
  @Column({ type: 'enum', enum: TransactionTypeEnum, nullable: false })
  type: TransactionTypeEnum;

  @ApiProperty({ description: 'Transaction status', required: true })
  @Column({ type: 'enum', enum: TransactionStatusEnum, default: TransactionStatusEnum.InProgress })
  status: TransactionStatusEnum;

  @ApiProperty({ description: 'Description', maximum: 256, required: false })
  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ApiProperty({ description: 'Reason', maximum: 256, required: false })
  @Column({ type: 'varchar', nullable: true })
  reason: string;

  @ApiProperty({ description: 'Created at date', required: true })
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.transaction)
  user: User;

  @ManyToOne(() => Card, (card) => card.transaction)
  card: Card;
}
