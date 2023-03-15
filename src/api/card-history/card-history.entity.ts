import { ApiProperty } from '@nestjs/swagger';
import { Card } from '@api/card/card.entity';
import {
  Column,
  CreateDateColumn,
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
