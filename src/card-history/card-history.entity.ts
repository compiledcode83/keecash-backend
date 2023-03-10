import { ApiProperty } from '@nestjs/swagger';
import { Card } from '@src/card/card.entity';
import { CryptoCurrencyEnum } from '@src/crypto-tx/crypto-tx.types';
import { User } from '@src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardTxStatusEnum } from './card-history.types';

@Entity('card_history')
export class CardHistory {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'enum', enum: CardTxStatusEnum, default: CardTxStatusEnum.InProgress })
  status: CardTxStatusEnum;

  @Column({ type: 'float', nullable: false })
  amount: number;

  @ApiProperty({ description: 'Created at date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at date' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Card, (card) => card.history)
  @JoinColumn({ name: 'card_id', referencedColumnName: 'id' })
  card: Card;
}
