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
  ManyToOne,
} from 'typeorm';
import { AuthRefreshToken } from '@src/auth-refresh-token/auth-refresh-token.entity';
import { PersonProfile } from '../person-profile/person-profile.entity';
import { Document } from '../document/document.entity';
import { EnterpriseProfile } from '../enterprise-profile/enterprise-profile.entity';
import { CryptoTx } from '@src/crypto-tx/crypto-tx.entity';
import { BeneficiaryUser } from '@src/beneficiary/table/beneficiary-user.entity';
import { Country } from '../country/country.entity';
import { AccountType, Language, Status } from './user.types';

@Entity('user')
export class User {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'First name', maximum: 128, required: true })
  @Column({ type: 'varchar', nullable: true, length: 128 })
  firstName: string;

  @ApiProperty({ description: 'Second name', maximum: 128, required: true })
  @Column({ type: 'varchar', nullable: true, length: 128 })
  secondName: string;

  @ApiProperty({ description: 'Referral id', maximum: 128, required: true })
  @Column({ type: 'varchar', nullable: false, length: 128 })
  referralId: string;

  @ApiProperty({
    description: 'Referral applied id',
    maximum: 128,
    required: false,
  })
  @Column({ type: 'varchar', nullable: true, length: 128 })
  referralAppliedId: string;

  @ApiProperty({ description: 'E-mail', maximum: 255, required: true })
  @Column({ type: 'varchar', nullable: false, length: 255 })
  email: string;

  @ApiProperty({ description: 'Phone number', maximum: 255, required: true })
  @Column({ type: 'varchar', nullable: true, length: 255 })
  phoneNumber: string;

  @ApiProperty({ description: 'Country Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: true })
  countryId: number;

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
    description: 'Account type',
    maximum: 255,
    required: true,
  })
  @Column({ type: 'enum', enum: AccountType, default: AccountType.PERSON })
  type: AccountType;

  @ApiProperty({
    description: 'Status',
    maximum: 255,
    required: true,
  })
  @Column({ type: 'enum', enum: Status, default: Status.REGISTERED })
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

  @OneToMany(() => AuthRefreshToken, (authRefreshToken) => authRefreshToken.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  refreshTokens: AuthRefreshToken[];

  @OneToMany(() => Document, (document) => document.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  documents: Document[];

  @OneToOne(() => PersonProfile, (personProfile: PersonProfile) => personProfile.user)
  personProfile: PersonProfile;

  @OneToOne(
    () => EnterpriseProfile,
    (enterpriseProfile: EnterpriseProfile) => enterpriseProfile.user,
  )
  enterpriseProfile: EnterpriseProfile;

  @OneToMany(() => CryptoTx, (cryptoTx) => cryptoTx.userSender)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_sender_id' })
  sender: CryptoTx[];

  @OneToMany(() => CryptoTx, (cryptoTx) => cryptoTx.userReceiver)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_receiver_id' })
  receiver: CryptoTx[];

  @OneToMany(() => BeneficiaryUser, (beneficiaryUser) => beneficiaryUser.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  userBeneficiary: BeneficiaryUser[];

  @ManyToOne(() => Country, (country) => country.user)
  country: Country;
}
