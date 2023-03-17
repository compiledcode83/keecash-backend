import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class PasswordResetDto {
  @ApiProperty({ example: 'eyz2igasgo', required: true, description: 'Token' })
  @IsString()
  @MinLength(1)
  token: string;

  @ApiProperty({ example: 'password123!@#', required: true, minimum: 8, description: 'Password' })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}
