import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardTypeEnum } from './card.types';
import { User } from '../user/user.entity';
import { FiatCurrencyEnum } from '../crypto-tx/crypto-tx.types';
import { Transaction } from '../transaction/transaction.entity';

@Entity('card')
export class Card {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Owner Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ApiProperty({ example: 'Chameleon', description: 'Card name' })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({ example: 'EUR', description: 'Currency' })
  @Column({ type: 'enum', enum: FiatCurrencyEnum, default: FiatCurrencyEnum.EUR })
  currency: FiatCurrencyEnum;

  @ApiProperty({ example: '1234 1334 1234 1234', description: 'Card number' })
  @Column({ type: 'varchar', nullable: false })
  cardNumber: string;

  @ApiProperty({ example: 'John Doe', description: 'Cardholder name' })
  @Column({ type: 'varchar', nullable: false })
  cardholderName: string;

  @ApiProperty({ example: '928', description: 'Card Verification Value(CVV) number' })
  @Column({ type: 'varchar', nullable: false })
  cvvNumber: string;

  @ApiProperty({ example: '09/25', description: 'Card expiration date: MM/YY' })
  @Column({ type: 'varchar', nullable: false })
  expiryDate: string;

  @ApiProperty({ example: 'https://logo.com/logo.png', description: 'Logo image URL' })
  @Column({ type: 'varchar', nullable: true })
  logo: string;

  @ApiProperty({ description: 'Keecash card Id' })
  @Column({ type: 'varchar', nullable: false })
  keecashCardId: string;

  @ApiProperty({ description: 'Provider card Id' })
  @Column({ type: 'varchar', nullable: false })
  providerCardId: string;

  @ApiProperty({ description: 'Encrypted card number' })
  @Column({ type: 'varchar', nullable: false })
  encryptedCardNumber: string;

  @ApiProperty({ description: 'Encrypted cvv number' })
  @Column({ type: 'varchar', nullable: false })
  encryptedCvvNumber: string;

  @ApiProperty({ description: 'Card type - Unique or Multiple' })
  @Column({ type: 'enum', enum: CardTypeEnum })
  type: CardTypeEnum;

  @ApiProperty({ description: 'Is card blocked' })
  @Column({ type: 'boolean', default: false })
  isBlocked: boolean;

  @ApiProperty({ description: 'Is card expired' })
  @Column({ type: 'boolean', default: false })
  isExpired: boolean;

  @ApiProperty({ description: 'Created at date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at date' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Deleted at date' })
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.card)
  transaction: Transaction[];

  @ManyToOne(() => User, (user) => user.cards)
  user: User;
}
