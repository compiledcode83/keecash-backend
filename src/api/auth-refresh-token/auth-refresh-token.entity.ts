import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '@api/user/user.entity';

@Entity('auth_refresh_token')
export class AuthRefreshToken {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'User Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ApiProperty({ description: 'Ip address', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false })
  ipaddress: string;

  @ApiProperty({ description: 'User agent', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false })
  useragent: string;

  @ApiProperty({ description: 'Token', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  token: string;

  @ApiProperty({ description: 'Created at date', required: true })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Expire at date', required: true })
  @Column({ type: 'timestamptz', nullable: false })
  expireAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;
}
