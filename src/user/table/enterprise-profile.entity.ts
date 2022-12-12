import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '@src/user/table/user.entity';
import { Country } from './country.entity';
import { Shareholder } from './shareholder.entity';

export enum Position {
  SECRETARY = 'SECRETARY',
  CHAIRPERSON = 'CHAIRPERSON',
  CFO = 'CFO',
}

@Entity('enterprise_profile')
export class EnterpriseProfile {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({
    description: 'Document Type',
    maximum: 255,
    required: true,
  })
  @Column({
    type: 'enum',
    enum: Position,
    default: Position.SECRETARY,
  })
  position: Position;

  @ApiProperty({ description: 'Entity Type', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  entityType: string;

  @ApiProperty({ description: 'Company Name', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  companyName: string;

  @ApiProperty({ description: 'Country Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  countryId: number;

  @ApiProperty({
    description: 'Country Registeration Number',
    maximum: 64,
    required: true,
  })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  companyRegisterationNumber: string;

  @ApiProperty({ description: 'Vat Number', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  vatNumber: string;

  @ApiProperty({ description: 'Address', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  address1: string;

  @ApiProperty({ description: 'Address2', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: true, length: 64 })
  address2: string;

  @ApiProperty({ description: 'zipcode', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  zipcode: string;

  @ApiProperty({ description: 'City', required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  city: string;

  @ManyToOne(() => Country, (country) => country.personProfile)
  country: Country;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => Shareholder, (shareholder) => shareholder.enterpriseProfile)
  @JoinColumn({ name: 'id', referencedColumnName: 'enterprise_profile_id' })
  shareholders: Shareholder[];
}
