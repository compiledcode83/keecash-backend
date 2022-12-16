import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('fee')
export class Fee {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Fee value name', maximum: 64, required: true })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({ description: 'Fee value name', maximum: 64, required: true })
  @Column({ type: 'float', nullable: false })
  value: number;
}
