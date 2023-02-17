import { ApiProperty } from '@nestjs/swagger';
import { Fee } from '@src/fee/fee.entity';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('country')
export class Country {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Country name', maximum: 128, required: false })
  @Column({ type: 'varchar', nullable: false, length: 128 })
  name: string;

  @ApiProperty({ description: 'Country code', maximum: 128, required: false })
  @Column({ type: 'varchar', nullable: false, length: 128 })
  countryCode: string;

  @ApiProperty({ description: 'Phone code', maximum: 128, required: false })
  @Column({ type: 'varchar', nullable: false, length: 128 })
  phoneCode: string;

  @ApiProperty({
    description: 'If the country is active now.',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'boolean', nullable: false, default: true })
  is_active: boolean;

  @ApiProperty({
    description: 'Message if the country is inactive',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'varchar', nullable: false, default: '', length: 128 })
  inactiveMessage: string;

  @ApiProperty({
    description: 'If the country is in maintenance.',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'boolean', nullable: false, default: false })
  isAppInMaintenance: boolean;

  @ApiProperty({
    description: 'Message if the country is in maintenance',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'varchar', nullable: false, length: 128, default: '' })
  inMaintenanceMessage: string;

  @ApiProperty({
    description: 'If deposit is active in this country.',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'boolean', nullable: false, default: true })
  depositIsActivate: boolean;

  @ApiProperty({
    description: 'Message if deposit is not available in this country',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'varchar', nullable: false, length: 128, default: '' })
  depositMessage: string;

  @ApiProperty({
    description: 'If withdraw is active in this country.',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'boolean', nullable: false, default: true })
  withdrawIsActivate: boolean;

  @ApiProperty({
    description: 'Message if withdraw is not available in this country',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'varchar', nullable: false, length: 128, default: '' })
  withdrawMessage: string;

  @ApiProperty({
    description: 'If transfer is active in this country.',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'boolean', nullable: false, default: true })
  transferIsActivate: boolean;

  @ApiProperty({
    description: 'Message if transfer is not available in this country',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'varchar', nullable: false, length: 128, default: '' })
  transferMessage: string;

  @ApiProperty({
    description: 'If card is active in this country.',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'boolean', nullable: false, default: true })
  cardIsActivate: boolean;

  @ApiProperty({
    description: 'Message if card is not available in this country',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'varchar', nullable: false, length: 128, default: '' })
  cardMessage: string;

  @ApiProperty({
    description: 'If card multiple is active in this country.',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'boolean', nullable: false, default: true })
  cardMultipleIsActivate: boolean;

  @ApiProperty({
    description: 'Message if card multiple is not available in this country',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'varchar', nullable: false, length: 128, default: '' })
  cardMultipleMessage: string;

  @ApiProperty({
    description: 'If card unique is active in this country.',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'boolean', nullable: false, default: true })
  cardUniqueIsActivate: boolean;

  @ApiProperty({
    description: 'Message if card unique is not available in this country',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'varchar', nullable: false, length: 128, default: '' })
  cardUniqueMessage: string;

  @ApiProperty({
    description: 'If card physic is active in this country.',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'boolean', nullable: false, default: true })
  cardPhysicIsActivate: boolean;

  @ApiProperty({
    description: 'Message if card physic is not available in this country',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'varchar', nullable: false, length: 128, default: '' })
  cardPhysicMessage: string;

  @OneToMany(() => User, (user) => user.country)
  @JoinColumn({ name: 'id', referencedColumnName: 'country_id' })
  user: User[];

  @OneToMany(() => Fee, (fee) => fee.country)
  @JoinColumn({ name: 'id', referencedColumnName: 'country_id' })
  fee: Fee[];
}
