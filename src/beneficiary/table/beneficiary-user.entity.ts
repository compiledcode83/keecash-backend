import { ApiProperty } from '@nestjs/swagger';
import { User } from '@src/user/table/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('beneficiary_user')
export class BeneficiaryUser {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'User Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  beneficiaryUserId: number;

  @ApiProperty({ description: 'User Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.userBeneficiary)
  user: User;
}
