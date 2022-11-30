import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class PasswordResetDto {
  @ApiProperty({
    example: 'user@example.com',
    required: true,
    maximum: 255,
    description: 'Email address',
  })
  @IsString()
  @MinLength(1)
  token: string;

  @ApiProperty({
    example: 'password123!@#',
    required: true,
    maximum: 255,
    description: 'Password',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}
