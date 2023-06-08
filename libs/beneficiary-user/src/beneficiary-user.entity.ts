import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@app/user/user.entity';

@Entity('beneficiary_user')
export class BeneficiaryUser {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Payer Id' })
  @Column({ nullable: false })
  payerId: number;

  @ApiProperty({ description: 'Payee Id' })
  @Column({ nullable: false })
  payeeId: number;

  @ApiProperty({ description: 'Created at date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at date' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Deleted at date' })
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.payer)
  @JoinColumn({ name: 'payer_id', referencedColumnName: 'id' })
  payer: User;

  @ManyToOne(() => User, (user) => user.payee)
  @JoinColumn({ name: 'payee_id', referencedColumnName: 'id' })
  payee: User;
}
