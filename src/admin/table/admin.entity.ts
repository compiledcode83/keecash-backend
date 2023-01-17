import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum AdminType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COUNTRY_MANAGER = 'COUNTRY_MANAGER',
  CUSTOMER_SUPPORT = 'CUSTOMER_SUPPORT',
}
@Entity('admin')
export class Admin {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'E-mail', maximum: 255, required: true })
  @Column({ type: 'varchar', nullable: false, length: 255 })
  email: string;

  @ApiProperty({ description: 'Password', maximum: 255, required: true })
  @Column({ type: 'varchar', nullable: false, length: 255 })
  password: string;

  @ApiProperty({
    description: 'Account type',
    maximum: 255,
    required: true,
  })
  @Column({ type: 'enum', enum: AdminType, default: AdminType.COUNTRY_MANAGER })
  type: AdminType;
}
