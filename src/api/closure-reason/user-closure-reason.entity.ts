import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { ClosureReason } from './closure-reason.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_closure_reason')
export class UserClosureReason {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'User ID', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ApiProperty({ description: 'Closure reason ID', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  closureReasonId: number;

  @ManyToOne(() => User, (user) => user.userClosureReason)
  user: User;

  @ManyToOne(() => ClosureReason, (closureReason) => closureReason.userClosureReason)
  closureReason: ClosureReason;
}
