import { Exclude } from 'class-transformer';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { ClosureReason } from './closure-reason.entity';

@Entity('user_closure_reason')
export class UserClosureReason {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => User, (user) => user.userClosureReason)
  user: User;

  @ManyToOne(() => ClosureReason, (closureReason) => closureReason.userClosureReason)
  closureReason: ClosureReason;
}
