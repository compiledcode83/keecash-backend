import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { AuthRefreshToken } from '@src/auth-refresh-token/auth-refresh-token.entity';
import { PersonProfile } from './person-profile.entity';
import { Document } from './document.entity';
import { EnterpriseProfile } from './enterprise-profile.entity';
import { CryptoTx } from '@src/crypto-tx/crypto-tx.entity';

export enum Language {
  ENGLISH = 'ENGLISH',
  FRANCH = 'FRANCH',
}

export enum AccountType {
  PERSON = 'PERSON',
  ENTERPRISE = 'ENTERPRISE',
  ADMIN = 'ADMIN',
}

export enum Status {
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  PENDING = 'Pending',
}

@Entity('user')
export class User {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'First name', maximum: 128, required: false })
  @Column({ type: 'varchar', nullable: false, length: 128 })
  firstName: string;

  @ApiProperty({ description: 'Second name', maximum: 128, required: false })
  @Column({ type: 'varchar', nullable: false, length: 128 })
  secondName: string;

  @ApiProperty({ description: 'E-mail', maximum: 255, required: true })
  @Column({ type: 'varchar', nullable: false, length: 255 })
  email: string;

  @ApiProperty({ description: 'Phone number', maximum: 255, required: true })
  @Column({ type: 'varchar', nullable: true, length: 255 })
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
    description: 'Status',
    maximum: 255,
    required: true,
  })
  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: Status;

  @ApiProperty({
    description: 'Date when the user was created',
    required: true,
  })
  @CreateDateColumn()
  registeredAt: Date;

  @ApiProperty({
    description: 'Date when the user was approved',
    required: false,
  })
  @Column({ type: 'timestamptz', nullable: true })
  approvedAt: Date;

  @ApiProperty({
    description: 'Date when user was rejected',
    required: false,
  })
  @Column({ type: 'timestamptz', nullable: true })
  rejectedAt: Date;

  @OneToMany(
    () => AuthRefreshToken,
    (authRefreshToken) => authRefreshToken.user,
  )
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  refreshTokens: AuthRefreshToken[];

  @OneToMany(() => Document, (document) => document.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  documents: Document[];

  @OneToOne(
    () => PersonProfile,
    (personProfile: PersonProfile) => personProfile.user,
  )
  personProfile: PersonProfile;

  @OneToOne(
    () => EnterpriseProfile,
    (enterpriseProfile: EnterpriseProfile) => enterpriseProfile.user,
  )
  enterpriseProfile: EnterpriseProfile;

  @OneToMany(() => CryptoTx, (cryptoTx) => cryptoTx.sender)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_sender_id' })
  sender: CryptoTx[];

  @OneToMany(() => CryptoTx, (cryptoTx) => cryptoTx.receiver)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_receiver_id' })
  receiver: CryptoTx[];
}
