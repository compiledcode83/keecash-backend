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
import { AuthRefreshToken } from '@api/auth-refresh-token/auth-refresh-token.entity';
import { PersonProfile } from './person-profile/person-profile.entity';
import { Document } from './document/document.entity';
import { EnterpriseProfile } from './enterprise-profile/enterprise-profile.entity';
import { CryptoTx } from '@api/crypto-tx/crypto-tx.entity';
import { BeneficiaryUser } from '@api/beneficiary/beneficiary-user/beneficiary-user.entity';
import { AccountType, Language, UserStatus } from './user.types';
import { BeneficiaryWallet } from '@api/beneficiary/beneficiary-wallet/beneficiary-wallet.entity';

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

  @ApiProperty({ description: 'Language', maximum: 255, required: true })
  @Column({ type: 'enum', enum: Language, default: Language.English })
  language: Language;

  @ApiProperty({ description: 'Account type', maximum: 255, required: true })
  @Column({ type: 'enum', enum: AccountType, default: AccountType.Person })
  type: AccountType;

  @ApiProperty({ description: 'Status', maximum: 255, required: true })
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.Registered })
  status: UserStatus;

  @ApiProperty({ description: 'Is pincode set' })
  @Column({ type: 'boolean', default: false })
  pin_code_set: boolean;

  @ApiProperty({ description: 'Date when the user was created', required: true })
  @CreateDateColumn()
  registeredAt: Date;

  @ApiProperty({ description: 'Date when the user was approved', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  approvedAt: Date;

  @ApiProperty({ description: 'Date when user was rejected', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  rejectedAt: Date;

  @OneToMany(() => AuthRefreshToken, (authRefreshToken) => authRefreshToken.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  refreshTokens: AuthRefreshToken[];

  @OneToMany(() => Document, (document) => document.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  documents: Document[];

  @OneToOne(() => PersonProfile, (personProfile) => personProfile.user)
  personProfile: PersonProfile;

  @OneToOne(() => EnterpriseProfile, (enterpriseProfile) => enterpriseProfile.user)
  enterpriseProfile: EnterpriseProfile;

  @OneToMany(() => CryptoTx, (cryptoTx) => cryptoTx.userSender)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_sender_id' })
  sender: CryptoTx[];

  @OneToMany(() => CryptoTx, (cryptoTx) => cryptoTx.userReceiver)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_receiver_id' })
  receiver: CryptoTx[];

  @OneToMany(() => BeneficiaryUser, (beneficiaryUser) => beneficiaryUser.payer)
  payer: BeneficiaryUser[];

  @OneToMany(() => BeneficiaryUser, (beneficiaryUser) => beneficiaryUser.payee)
  payee: BeneficiaryUser[];

  @OneToMany(() => BeneficiaryWallet, (beneficiaryWallet) => beneficiaryWallet.user)
  beneficiaryWallet: BeneficiaryWallet[];
}
