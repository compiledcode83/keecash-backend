import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '@api/user/user.entity';
import { FiatCurrencyEnum, TxTypeEnum } from '@api/crypto-tx/crypto-tx.types';
import { Card } from '../card/card.entity';
import { TransactionStatusEnum, ExternalTxMethodEnum } from './transaction.types';

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

  @ApiProperty({ description: 'Amount', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false })
  amount: number;

  @ApiProperty({ description: 'Wallet currency: EUR or USD', required: true })
  @Column({ type: 'enum', enum: FiatCurrencyEnum, default: FiatCurrencyEnum.EUR })
  currency: FiatCurrencyEnum;

  @ApiProperty({
    description: ` (applied for TxType: DEPOSIT, WITHDRAWAL, otherwise NULL)`,
    required: false,
  })
  @Column({ type: 'enum', enum: ExternalTxMethodEnum, nullable: true })
  externalTxMethod: ExternalTxMethodEnum;

  @ApiProperty({
    description:
      'Type of transaction: DEPOSIT | WITHDRAWAL | TRANSFER | CARD_CREATE_FEE | CARD_TOPUP | CARD_TOPUP_FEE | CARD_WITHDRAWAL | CARD_WITHDRAWAL_FEE',
    required: true,
  })
  @Column({ type: 'enum', enum: TxTypeEnum, nullable: false })
  type: TxTypeEnum;

  @ApiProperty({
    description: 'Card ID (Only applied for Card Transactions, otherwise NULL)',
    required: false,
  })
  @Column({ type: 'int', nullable: true })
  cardId: number;

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
