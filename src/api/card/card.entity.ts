import { ApiProperty } from '@nestjs/swagger';
import { CardHistory } from '@api/card-history/card-history.entity';
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

@Entity('card')
export class Card {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ example: 'Chameleon', description: 'Card name' })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({ example: 'EUR', description: 'Currency' })
  @Column({ type: 'enum', enum: FiatCurrencyEnum, default: FiatCurrencyEnum.EUR })
  currency: FiatCurrencyEnum;

  @ApiProperty({ example: '12345 1334', description: 'Card number' })
  @Column({ type: 'varchar', nullable: false })
  cardNumber: string;

  @ApiProperty({ example: '', description: 'Logo' })
  @Column({ type: 'varchar', nullable: false })
  logo: string;

  @ApiProperty({ description: 'Keecash card Id' })
  @Column({ type: 'varchar', nullable: false })
  keecashCardId: string;

  @ApiProperty({ description: 'Provider card Id' })
  @Column({ type: 'varchar', nullable: false })
  providerCardId: string;

  @ApiProperty({ description: 'Encrypted cc number' })
  @Column({ type: 'varchar', nullable: false })
  encryptedCcNumber: string;

  @ApiProperty({ description: 'Encrypted cvv number' })
  @Column({ type: 'varchar', nullable: false })
  encryptedCvvNumber: string;

  @ApiProperty({ description: 'Card expiration date' })
  @Column({ type: 'varchar', nullable: false })
  expiryDate: string;

  @ApiProperty({ description: 'Card type - Unique or Multiple' })
  @Column({ type: 'enum', enum: CardTypeEnum })
  type: CardTypeEnum;

  @ApiProperty({ description: 'Created at date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at date' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Deleted at date' })
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @OneToMany(() => CardHistory, (history) => history.card)
  history: CardHistory[];

  @ApiProperty({ description: 'User Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.cards)
  user: User;
}
