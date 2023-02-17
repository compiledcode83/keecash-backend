import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '@src/user/user.entity';

@Entity('person_profile')
export class PersonProfile {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Address', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  address: string;

  @ApiProperty({ description: 'City', required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  city: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
