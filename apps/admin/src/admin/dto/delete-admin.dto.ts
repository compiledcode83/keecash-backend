import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DeleteAdminDto {
  @ApiProperty({ example: 2, required: true, description: 'Admin ID' })
  @IsNumber()
  id: number;
}
