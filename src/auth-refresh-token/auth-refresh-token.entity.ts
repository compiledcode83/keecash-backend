import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '@src/user/user.entity';

@Entity('admin_refresh_token')
export class AuthRefreshToken {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @ApiProperty({ description: 'Token', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  token: string;

  @ApiProperty({ description: 'Created at date', required: true })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Expire at date', required: true })
  @Column({ type: 'timestamptz', nullable: false })
  expireAt: Date;

  @ManyToOne(() => User, (admin) => admin.refreshTokens)
  user: User;
}
