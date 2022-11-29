import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@src/user/user.entity';

export enum DocumentType {
  PASSPORT = 'Passport',
  DRIVELICENCE = 'Drive Licence',
  ID = 'ID',
  RESIDENTPERMIT = 'Resident Permit',
}

@Entity('person_profile')
export class PersonProfile {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Address', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  address1: string;

  @ApiProperty({ description: 'Address2', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  address2: string;

  @ApiProperty({ description: 'zipcode', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  zipcode: string;

  @ApiProperty({ description: 'City', required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  city: string;

  @ApiProperty({ description: 'Country', required: true })
  @Column({ type: 'varchar', nullable: false, length: 64 })
  country: string;

  @ApiProperty({
    description: 'Language',
    maximum: 255,
    required: true,
  })
  @Column({ type: 'enum', enum: DocumentType, default: DocumentType.PASSPORT })
  documentType: DocumentType;

  @ApiProperty({ description: 'Image link', required: true })
  @Column({ type: 'varchar', nullable: false, length: 255 })
  imageLink: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
