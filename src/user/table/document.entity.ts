import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export enum DOCUEMNT_TYPE {
  PASSPORT = 'PASSPORT',
  DRIVE_LICENSING = 'DRIVE_LICENSING',
  ID = 'ID',
  RESIDENT_PERMIT = 'RESIDENT_PERMIT',
  UBO = 'UBO',
  PROOF_COMPANY_REGISTERATION = 'PROOF_COMPANY_REGISTERATION',
}

@Entity('document')
export class Document {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'User Id', maximum: 64, required: true })
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ApiProperty({
    description: 'Document Type',
    maximum: 255,
    required: true,
  })
  @Column({
    type: 'enum',
    enum: DOCUEMNT_TYPE,
    default: DOCUEMNT_TYPE.PASSPORT,
  })
  type: DOCUEMNT_TYPE;

  @ApiProperty({ description: 'Image Link', maximum: 128, required: false })
  @Column({ type: 'varchar', nullable: true, length: 128 })
  imageLink: string;

  @ManyToOne(() => User, (user) => user.documents)
  user: User;
}
