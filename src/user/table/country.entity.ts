import { ApiProperty } from '@nestjs/swagger';
import { Fee } from '@src/fee/fee.entity';
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('country')
export class Country {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Country name', maximum: 128, required: false })
  @Column({ type: 'varchar', nullable: true, length: 128 })
  name: string;

  @OneToMany(() => User, (user) => user.country)
  @JoinColumn({ name: 'id', referencedColumnName: 'country_id' })
  user: User[];

  @OneToMany(() => Fee, (fee) => fee.country)
  @JoinColumn({ name: 'id', referencedColumnName: 'country_id' })
  fee: Fee[];
}
