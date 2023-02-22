import { ApiProperty } from '@nestjs/swagger';
import { User } from '@src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('beneficiary_user')
export class BeneficiaryUser {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'User Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ApiProperty({ description: 'Beneficiary User Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  beneficiaryUserId: number;

  @ApiProperty({ description: 'Created at date' })
  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at date' })
  @CreateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Deleted at date' })
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.mainUser)
  mainUser: User;

  @ManyToOne(() => User, (user) => user.beneficiaryUser)
  beneficiaryUser: User;
}
