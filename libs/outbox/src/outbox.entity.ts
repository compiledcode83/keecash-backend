import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { OutboxStatus } from './outbox.types';

@Entity('outbox')
export class Outbox {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 36 })
  operationUuid: string;

  @Column({ type: 'varchar', nullable: false })
  eventName: string;

  @Column({ type: 'text', nullable: false })
  payload: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: false })
  sendAfter: Date;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column({ type: 'enum', nullable: false, enum: OutboxStatus })
  status: OutboxStatus;
}
