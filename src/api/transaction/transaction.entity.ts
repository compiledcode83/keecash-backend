import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import {
  CryptoCurrencyEnum,
  FiatCurrencyEnum,
  TransactionStatusEnum,
  TxTypeEnum,
} from './transaction.types';
import { Card } from '@api/card/card.entity';
import { User } from '@api/user/user.entity';

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Sender ID', maximum: 64, required: false })
  @Column({ type: 'int', nullable: true })
  senderId: number;

  @ApiProperty({ description: 'Recevier ID', maximum: 64, required: false })
  @Column({ type: 'int', nullable: true })
  receiverId: number;

  @ApiProperty({ description: 'Wallet currency: EUR or USD', required: true })
  @Column({ type: 'enum', enum: FiatCurrencyEnum, default: FiatCurrencyEnum.EUR })
  currency: FiatCurrencyEnum;

  @ApiProperty({ description: 'Card price', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  cardPrice: number;

  @ApiProperty({ description: 'Total amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  targetAmount: number;

  @ApiProperty({ description: 'Applied amount', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true })
  appliedAmount: number;

  @ApiProperty({ description: 'Applied fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true, default: 0 })
  appliedFee: number;

  @ApiProperty({ description: 'Fixed fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true, default: 0 })
  fixedFee: number;

  @ApiProperty({ description: 'Percentage fee', maximum: 64, required: false })
  @Column({ type: 'float', nullable: true, default: 0 })
  percentageFee: number;

  @ApiProperty({
    description: 'Exchange rate (applied for exteneral transactions)',
    maximum: 64,
    required: false,
  })
  @Column({ type: 'float', nullable: true })
  exchangeRate: number;

  @ApiProperty({
    description: 'Card ID (Only applied for Card Transactions, otherwise NULL)',
    required: false,
  })
  @Column({ type: 'int', nullable: true })
  cardId: number;

  @ApiProperty({ example: 'SDF-453672-PMT', required: false })
  @Column({ type: 'varchar', nullable: true })
  tripleAPaymentReference: string;

  @ApiProperty({
    description: `Transaction method (applied for TxType: DEPOSIT, WITHDRAWAL, otherwise NULL)`,
    required: false,
  })
  @Column({ type: 'enum', enum: CryptoCurrencyEnum, nullable: true })
  externalTxMethod: CryptoCurrencyEnum;

  @ApiProperty({
    description:
      'Type of transaction: DEPOSIT | WITHDRAWAL | TRANSFER | CARD_CREATION | CARD_TOPUP | CARD_WITHDRAWAL',
    required: true,
  })
  @Column({ type: 'enum', enum: TxTypeEnum, nullable: false })
  type: TxTypeEnum;

  @ApiProperty({ description: 'Transaction status', required: true })
  @Column({ type: 'enum', enum: TransactionStatusEnum, default: TransactionStatusEnum.InProgress })
  status: TransactionStatusEnum;

  @ApiProperty({ description: 'Description (reason)', maximum: 256, required: false })
  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ApiProperty({ description: 'Created at date', required: true })
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sender)
  sender: User;

  @ManyToOne(() => User, (user) => user.receiver)
  receiver: User;

  @ManyToOne(() => Card, (card) => card.transaction)
  card: Card;
}
