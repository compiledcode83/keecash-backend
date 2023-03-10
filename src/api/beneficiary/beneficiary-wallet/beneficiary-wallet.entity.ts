import { ApiProperty } from '@nestjs/swagger';
import { CryptoCurrencyEnum } from '@api/crypto-tx/crypto-tx.types';
import { User } from '@api/user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('beneficiary_wallet')
export class BeneficiaryWallet {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'User Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ApiProperty({ description: 'Address', maximum: 256, required: true })
  @Column({ type: 'varchar', nullable: false })
  address: string;

  @ApiProperty({ description: 'name', maximum: 256, required: true })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    description: 'Crypto transaction type',
    maximum: 255,
    required: true,
  })
  @Column({ type: 'enum', enum: CryptoCurrencyEnum })
  type: CryptoCurrencyEnum;

  @ApiProperty({ description: 'Created at date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at date' })
  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty({ description: 'Deleted at date' })
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.beneficiaryWallet)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
