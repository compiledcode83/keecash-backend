import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '@api/user/user.entity';
import { FiatCurrencyEnum, TxTypeEnum } from './crypto-tx.types';

@Entity('crypto_tx')
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

  @ApiProperty({
    description: 'Crypto currency name',
    maximum: 255,
    required: true,
  })
  @Column({
    type: 'enum',
    enum: FiatCurrencyEnum,
    default: FiatCurrencyEnum.EUR,
  })
  currencyName: FiatCurrencyEnum;

  @ApiProperty({
    description: 'Crypto transaction type',
    maximum: 255,
    required: true,
  })
  @Column({
    type: 'enum',
    enum: TxTypeEnum,
    default: TxTypeEnum.Deposit,
  })
  type: TxTypeEnum;

  @ApiProperty({ description: 'Description', maximum: 256, required: true })
  @Column({ type: 'varchar', nullable: false })
  description: string;

  @ApiProperty({
    description: 'Payment reference',
    maximum: 64,
    required: true,
  })
  @Column({ type: 'varchar', nullable: false })
  paymentReference: string;

  @ApiProperty({ description: 'Created at date', required: true })
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sender)
  userSender: User;

  @ManyToOne(() => User, (user) => user.receiver)
  userReceiver: User;
}
