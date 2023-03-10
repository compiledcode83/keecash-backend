import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'user@example.com',
    required: true,
    maximum: 255,
    description: 'E-mail',
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
