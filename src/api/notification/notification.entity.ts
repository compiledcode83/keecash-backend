import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationCurrencyType, NotificationType } from './notification.types';

@Entity('notification')
export class Notification {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'User Id', required: true })
  @Column({ type: 'int', nullable: true })
  userId: number;

  @ApiProperty({ description: 'Notification type', maximum: 255, required: true })
  @Column({ type: 'enum', enum: NotificationType, nullable: false })
  type: NotificationType;

  @ApiProperty({ description: 'Notification message', maximum: 256, required: true })
  @Column({ type: 'varchar', nullable: false, length: 256 })
  message: string;

  @ApiProperty({ description: 'Amount of funds', required: false })
  @Column({ type: 'float', nullable: true })
  amount: number;

  @ApiProperty({ description: 'Notification type', maximum: 255, required: true })
  @Column({ type: 'enum', enum: NotificationCurrencyType, nullable: false })
  currency: NotificationCurrencyType;

  @ApiProperty({ description: 'Url of avatar image', maximum: 256, required: true })
  @Column({ type: 'varchar', nullable: true, length: 256 })
  urlAvatar: string;

  @ApiProperty({ description: 'Card brand', maximum: 256, required: true })
  @Column({ type: 'varchar', nullable: true, length: 256 })
  cardBrand: string;

  @ApiProperty({ description: 'Card name', maximum: 256, required: true })
  @Column({ type: 'varchar', nullable: true, length: 256 })
  cardName: string;

  @ApiProperty({ description: 'If user has read this message' })
  @Column({ type: 'boolean', default: false })
  hasRead: boolean;

  @ApiProperty({ description: 'When the notification is sent', required: true })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the notification is deleted', required: true })
  @DeleteDateColumn()
  deletedAt: Date;
}
