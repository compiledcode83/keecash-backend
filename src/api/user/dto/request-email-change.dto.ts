import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RequestEmailChangeDto {
  @ApiProperty({ example: 'john.doe@example.com', required: true, description: 'New email' })
  @IsEmail()
  email: string;
}
