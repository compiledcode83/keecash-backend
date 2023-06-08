import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '@app/user/user.entity';

@Entity('person_profile')
export class PersonProfile {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'User Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: true })
  userId: number;

  @ApiProperty({ description: 'First name', maximum: 128, required: true })
  @Column({ type: 'varchar', nullable: true, length: 128 })
  firstName: string;

  @ApiProperty({ description: 'Last name', maximum: 128, required: true })
  @Column({ type: 'varchar', nullable: true, length: 128 })
  lastName: string;

  @ApiProperty({ description: 'Address 1', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  address1: string;

  @ApiProperty({ description: 'Address 2', maximum: 64, required: false })
  @Column({ type: 'varchar', nullable: true, length: 64 })
  address2: string;

  @ApiProperty({ description: 'ZIP Code', maximum: 16, required: true })
  @Column({ type: 'varchar', nullable: false, length: 16 })
  zipcode: string;

  @ApiProperty({ description: 'City', required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  city: string;

  @ApiProperty({ description: 'State', required: false })
  @Column({ type: 'varchar', nullable: true, length: 64 })
  state: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
