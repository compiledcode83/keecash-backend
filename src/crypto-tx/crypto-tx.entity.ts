import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '@src/user/table/user.entity';

export enum CURRENCY_NAME {
  BTC = 'BTC',
  ETHER = 'ETHER',
  USDT = 'USDT',
}

@Entity('crypto-tx')
export class CryptoTx {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Sender User', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  userSenderId: number;

  @ApiProperty({ description: 'Recevier User', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  userReceiverId: number;

  @ApiProperty({ description: 'Amount', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false })
  amount: number;

  @ApiProperty({ description: 'Description', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false })
  description: string;

  @ApiProperty({ description: 'Transaction Hash', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false })
  transactionHash: string;

  @ApiProperty({
    description: 'Crypto currency name',
    maximum: 255,
    required: true,
  })
  @Column({
    type: 'enum',
    enum: CURRENCY_NAME,
    default: CURRENCY_NAME.USDT,
  })
  currencyName: CURRENCY_NAME;

  @ApiProperty({ description: 'Created at date', required: true })
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sender)
  sender: User;

  @ManyToOne(() => User, (user) => user.receiver)
  receiver: User;
}
