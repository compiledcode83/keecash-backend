import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CardUsageEnum } from './card.types';
import { User } from '@app/user';
import { Transaction } from '@app/transaction';
import { FiatCurrencyEnum } from '@app/common';

@Entity('card')
export class Card {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Unique uid', maximum: 36 })
  @Column({ type: 'varchar', nullable: false, length: 36 })
  uuid: string;

  @ApiProperty({ description: 'Owner Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ApiProperty({ example: 'Chameleon', description: 'Card name' })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({ description: 'Card currency' })
  @Column({ type: 'enum', enum: FiatCurrencyEnum, nullable: true })
  currency: FiatCurrencyEnum;

  @ApiProperty({ description: 'Card usage type - UNIQUE or MULTIPLE' })
  @Column({ type: 'enum', enum: CardUsageEnum, nullable: true })
  usage: CardUsageEnum;

  @ApiProperty({ description: 'Card ID registered in Bridgecard' })
  @Column({ type: 'varchar', nullable: true })
  bridgecardId: string;

  @ApiProperty({ description: 'Is card blocked by admin' })
  @Column({ type: 'boolean', default: false })
  isBlocked: boolean;

  @ManyToOne(() => User, (user) => user.cards)
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.card)
  transaction: Transaction[];
}
