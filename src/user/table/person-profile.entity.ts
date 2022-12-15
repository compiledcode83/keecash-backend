import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@src/user/table/user.entity';
import { Country } from './country.entity';

@Entity('person_profile')
export class PersonProfile {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Address', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  address: string;

  @ApiProperty({ description: 'zipcode', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  zipcode: string;

  @ApiProperty({ description: 'City', required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  city: string;

  @ApiProperty({ description: 'Country Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  countryId: number;

  @ManyToOne(() => Country, (country) => country.personProfile)
  country: Country;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
