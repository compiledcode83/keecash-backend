import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class PasswordLoginDto {
  @ApiProperty({
    example: 'user@example.com / +1234567890',
    required: true,
    maximum: 255,
    description: 'Email or phone number',
  })
  @MaxLength(255)
  emailOrPhoneNumber: string;

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
