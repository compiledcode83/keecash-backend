import { ApiProperty } from '@nestjs/swagger';
import { CRYTPO_CURRENCY_NAME } from '@src/crypto-tx/crypto-tx.entity';
import { User } from '@src/user/table/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('beneficiary_wallet')
export class BeneficiaryWallet {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'User Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ApiProperty({
    description: 'Crypto transaction type',
    maximum: 255,
    required: true,
  })
  @Column({
    type: 'enum',
    enum: CRYTPO_CURRENCY_NAME,
  })
  type: CRYTPO_CURRENCY_NAME;

  @ApiProperty({ description: 'Address', maximum: 256, required: true })
  @Column({ type: 'varchar', nullable: false })
  address: string;

  @ApiProperty({ description: 'name', maximum: 256, required: true })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ManyToOne(() => User, (user) => user.users)
  user: User;
}
