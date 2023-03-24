import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '@api/user/user.entity';
import { TokenTypeEnum } from './cipher-token.types';

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

  @ApiProperty({ description: 'Created at date', required: true })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Expire at date', required: true })
  @Column({ type: 'timestamptz', nullable: false })
  expireAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;
}
