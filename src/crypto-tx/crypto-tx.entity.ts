import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '@src/user/table/user.entity';

export enum CRYTPO_CURRENCY_NAME {
  BTC = 'BTC',
  LNBC = 'LNBC',
  ETH_ERC20 = 'ETH',
  USDT_ERC20 = 'USDT',
  USDT_TRC20 = 'USDT_TRC20',
  USDC_ERC20 = 'USDC',
}

export enum FIAT_CURRENCY_NAME {
  USD = 'USD',
  EUR = 'EUR',
}

export enum TX_TYPE {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
}

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
    enum: FIAT_CURRENCY_NAME,
    default: FIAT_CURRENCY_NAME.EUR,
  })
  currencyName: FIAT_CURRENCY_NAME;

  @ApiProperty({
    description: 'Crypto transaction type',
    maximum: 255,
    required: true,
  })
  @Column({
    type: 'enum',
    enum: TX_TYPE,
    default: TX_TYPE.DEPOSIT,
  })
  type: TX_TYPE;

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
