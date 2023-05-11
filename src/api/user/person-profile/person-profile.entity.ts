import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '@api/user/user.entity';
import { Country } from '@api/country/country.entity';
import { CountryActivation } from '@api/country-activation/country-activation.entity';

@Entity('person_profile')
export class PersonProfile {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'User Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: true })
  userId: number;

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

  @ApiProperty({ description: 'Country Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: true })
  countryId: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Country, (country) => country.personProfile)
  country: Country;
}
