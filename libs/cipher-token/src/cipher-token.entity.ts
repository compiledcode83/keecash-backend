import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { TokenTypeEnum } from './cipher-token.types';
import { FiatCurrencyEnum } from 'libs/transaction/src/transaction.types';

@Entity('cipher_token')
export class CipherToken {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'User Id', maximum: 64, required: false })
  @Column({ type: 'int', nullable: true })
  userId: number;

  @ApiProperty({ description: 'Ip address', maximum: 64, required: false })
  @Column({ type: 'varchar', nullable: true })
  ipAddress: string;

  @ApiProperty({ description: 'User agent', maximum: 64, required: false })
  @Column({ type: 'varchar', nullable: true })
  userAgent: string;

  @ApiProperty({ description: 'Token', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  token: string;

  @ApiProperty({ description: 'Token type', required: true })
  @Column({ type: 'enum', enum: TokenTypeEnum, nullable: false })
  type: TokenTypeEnum;

  @ApiProperty({ description: 'Currency for TripleA access token', required: false })
  @Column({ type: 'enum', enum: FiatCurrencyEnum, nullable: true })
  currency: FiatCurrencyEnum;

  @ApiProperty({ description: 'Created at date', required: true })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Expire at date', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  expireAt: Date;
}
