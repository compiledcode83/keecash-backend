import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '@app/user/user.entity';
import { DocumentTypeEnum } from './document.types';

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
    enum: DocumentTypeEnum,
    default: DocumentTypeEnum.Passport,
  })
  type: DocumentTypeEnum;

  @ApiProperty({ description: 'Image Link', maximum: 128, required: false })
  @Column({ type: 'varchar', nullable: true, length: 128 })
  imageLink: string;

  @ManyToOne(() => User, (user) => user.documents)
  user: User;
}
