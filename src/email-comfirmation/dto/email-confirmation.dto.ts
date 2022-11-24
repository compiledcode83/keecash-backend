import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EmailConfirmationDTO {
  @ApiProperty({
    example: 'user@example.com',
    required: true,
  })
  @IsString()
  email: string;
}
