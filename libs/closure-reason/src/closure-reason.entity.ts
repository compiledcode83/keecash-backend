import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserClosureReason } from './user-closure-reason.entity';

@Entity('closure_reason')
export class ClosureReason {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Closure Reason', maximum: 128, required: true })
  @Column({ type: 'varchar', nullable: false, length: 128 })
  reason: string;

  @OneToMany(() => UserClosureReason, (userClosureReason) => userClosureReason.closureReason)
  userClosureReason: UserClosureReason[];
}
