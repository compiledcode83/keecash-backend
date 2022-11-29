import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { AuthRefreshToken } from '@src/auth-refresh-token/auth-refresh-token.entity';
import { PersonProfile } from './person-profile.entity';

export enum Language {
  ENGLISH = 'ENGLISH',
  FRANCH = 'FRANCH',
}

export enum AccountType {
  PERSON = 'PERSON',
  ENTERPRISE = 'ENTERPRISE',
}

@Entity('user')
export class User {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: `Unique uuid`, maximum: 36 })
  @Column({ type: 'varchar', nullable: false, length: 36 })
  uuid: string;

  @ApiProperty({ description: 'Full name', maximum: 128, required: false })
  @Column({ type: 'varchar', nullable: true, length: 128 })
  name: string;

  @ApiProperty({ description: 'E-mail', maximum: 255, required: true })
  @Column({ type: 'varchar', nullable: false, length: 255 })
  email: string;

  @ApiProperty({ description: 'Phone number', maximum: 255, required: true })
  @Column({ type: 'varchar', nullable: false, length: 255 })
  phoneNumber: string;

  @ApiProperty({ description: 'Password', maximum: 255, required: true })
  @Column({ type: 'varchar', nullable: false, length: 255 })
  password: string;

  @ApiProperty({
    description: 'Language',
    maximum: 255,
    required: true,
  })
  @Column({ type: 'enum', enum: Language, default: Language.ENGLISH })
  language: Language;

  @ApiProperty({
    description: 'Language',
    maximum: 255,
    required: true,
  })
  @Column({ type: 'enum', enum: AccountType, default: AccountType.PERSON })
  accountType: AccountType;

  @ApiProperty({
    description: 'Date when the user was created',
    required: true,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when user was updated the last time',
    required: false,
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(
    () => AuthRefreshToken,
    (authRefreshToken) => authRefreshToken.user,
  )
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  refreshTokens: AuthRefreshToken[];

  @OneToOne(
    () => PersonProfile,
    (personProfile: PersonProfile) => personProfile.user,
  )
  personProfile: PersonProfile;
}
