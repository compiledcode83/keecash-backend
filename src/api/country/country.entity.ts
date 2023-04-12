import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { CountryActivation } from '@api/country-activation/country-activation.entity';
import { PersonProfile } from '@api/user/person-profile/person-profile.entity';

@Entity('country')
export class Country {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Country name', maximum: 128, required: true })
  @Column({ type: 'varchar', nullable: false, length: 128 })
  name: string;

  @ApiProperty({ description: 'Country code', maximum: 128, required: true })
  @Column({ type: 'varchar', nullable: false, length: 128 })
  countryCode: string;

  @ApiProperty({ description: 'Phone code', maximum: 128, required: true })
  @Column({ type: 'varchar', nullable: false, length: 128 })
  phoneCode: string;

  @OneToOne(() => CountryActivation, (activation) => activation.country, { cascade: true })
  activation: CountryActivation;

  @OneToMany(() => PersonProfile, (personProfile) => personProfile.country)
  @JoinColumn({ name: 'id', referencedColumnName: 'country_id' })
  personProfile: PersonProfile[];
}
