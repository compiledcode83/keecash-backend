import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { EnterpriseProfile } from './enterprise-profile.entity';

@Entity('shareholder')
export class Shareholder {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({
    description: 'Enterprise Profile Id',
    maximum: 64,
    required: true,
  })
  @Column({ type: 'int', nullable: false })
  enterpriseProfileId: number;

  @ApiProperty({ description: 'First Name', maximum: 128, required: false })
  @Column({ type: 'varchar', nullable: true, length: 128 })
  firstName: string;

  @ApiProperty({ description: 'Second Name', maximum: 128, required: false })
  @Column({ type: 'varchar', nullable: true, length: 128 })
  secondName: string;

  @ManyToOne(() => EnterpriseProfile, (enterpriseProfile) => enterpriseProfile.shareholders)
  enterpriseProfile: EnterpriseProfile;
}
