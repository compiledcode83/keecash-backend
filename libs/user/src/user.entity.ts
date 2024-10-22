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
import { Country } from '@app/country';
import { PersonProfile } from '@app/person-profile';
import { Document } from '@app/document';
import { EnterpriseProfile } from '@app/enterprise-profile';
import { BeneficiaryUser } from '@app/beneficiary-user';
import { BeneficiaryWallet } from '@app/beneficiary-wallet';
import { Card } from '@app/card';
import { Transaction } from '@app/transaction';
import { UserClosureReason } from '@app/closure-reason';
import { AccountType, Language, UserStatus, VerificationStatus } from './user.types';

@Entity('user')
export class User {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Unique uid', maximum: 36 })
  @Column({ type: 'varchar', nullable: false, length: 36 })
  uuid: string;

  @ApiProperty({ description: 'Referral id', maximum: 8, required: true })
  @Column({ type: 'varchar', nullable: false, length: 8 })
  referralId: string;

  @ApiProperty({ description: 'Referral applied id', maximum: 8, required: false })
  @Column({ type: 'varchar', nullable: true, length: 8 })
  referralAppliedId: string;

  @ApiProperty({ description: 'E-mail', maximum: 255, required: true })
  @Column({ type: 'varchar', nullable: false, length: 255 })
  email: string;

  @ApiProperty({ description: 'Phone number', maximum: 255, required: true })
  @Column({ type: 'varchar', nullable: true, length: 255 })
  phoneNumber: string;

  @ApiProperty({ description: 'Password', maximum: 255, required: true })
  @Column({ type: 'varchar', nullable: false, length: 255 })
  password: string;

  @ApiProperty({ description: 'PIN Code', maximum: 255, required: true })
  @Column({ type: 'varchar', nullable: true, length: 255 })
  pincode: string;

  @ApiProperty({ description: 'Avatar URL', maximum: 255, required: true })
  @Column({ type: 'varchar', nullable: true, length: 255 })
  urlAvatar: string;

  @ApiProperty({ description: 'Country Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: true })
  countryId: number;

  @ApiProperty({ description: 'Language', maximum: 255, required: true })
  @Column({ type: 'enum', enum: Language, default: Language.English })
  language: Language;

  @ApiProperty({ description: 'Account type', maximum: 255, required: true })
  @Column({ type: 'enum', enum: AccountType, default: AccountType.Person })
  type: AccountType;

  @ApiProperty({ description: 'Status', maximum: 255, required: true })
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.Registered })
  status: UserStatus;

  @ApiProperty({ description: 'KYC verification status' })
  @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.NotStarted })
  kycStatus: VerificationStatus;

  @ApiProperty({ description: 'KYB verification status' })
  @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.NotStarted })
  kybStatus: VerificationStatus;

  @ApiProperty({ description: 'Is email validated' })
  @Column({ type: 'boolean', default: false })
  emailValidated: boolean;

  @ApiProperty({ description: 'Is phone validated' })
  @Column({ type: 'boolean', default: false })
  phoneValidated: boolean;

  @ApiProperty({ description: 'Is pincode set' })
  @Column({ type: 'boolean', default: false })
  pincodeSet: boolean;

  @ApiProperty({ description: 'Message that user leaves while closing account' })
  @Column({ type: 'varchar', nullable: true, length: 255 })
  leavingMessage: string;

  @ApiProperty({ description: 'Date when the user was created', required: true })
  @CreateDateColumn()
  registeredAt: Date;

  @ApiProperty({ description: 'Date when the user was approved', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  approvedAt: Date;

  @ApiProperty({ description: 'Date when user was rejected', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  rejectedAt: Date;

  @ApiProperty({ description: 'Bridgecard cardholder ID', required: false })
  @Column({ type: 'varchar', nullable: true, length: 255, unique: true })
  cardholderId: string;

  @ApiProperty({ description: 'Is Bridgecard cardholder profile verified' })
  @Column({ type: 'boolean', default: false })
  cardholderVerified: boolean;

  @Exclude()
  @Column({ type: 'text', nullable: true })
  errorData: string;

  @OneToMany(() => Card, (card) => card.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  cards: Card[];

  @OneToMany(() => Document, (document) => document.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  documents: Document[];

  @ManyToOne(() => Country, (country) => country.user)
  country: Country;

  @OneToOne(() => PersonProfile, (personProfile) => personProfile.user)
  personProfile: PersonProfile;

  @OneToOne(() => EnterpriseProfile, (enterpriseProfile) => enterpriseProfile.user)
  enterpriseProfile: EnterpriseProfile;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  transaction: Transaction[];

  @OneToMany(() => BeneficiaryUser, (beneficiaryUser) => beneficiaryUser.payer)
  payer: BeneficiaryUser[];

  @OneToMany(() => BeneficiaryUser, (beneficiaryUser) => beneficiaryUser.payee)
  payee: BeneficiaryUser[];

  @OneToMany(() => BeneficiaryWallet, (beneficiaryWallet) => beneficiaryWallet.user)
  beneficiaryWallet: BeneficiaryWallet[];

  @OneToMany(() => UserClosureReason, (userClosureReason) => userClosureReason.user)
  userClosureReason: UserClosureReason[];
}
