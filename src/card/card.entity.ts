import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardTypeEnum } from './card.type';

@Entity('card')
export class Card {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Card name' })
  @Column({ type: 'varchar', nullable: false })
  name: string;

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
}
