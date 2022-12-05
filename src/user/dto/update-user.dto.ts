import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    required: false,
    minimum: 1,
    maximum: 128,
    description: 'Full name',
  })
  @ValidateIf((o) => (!o?.email && !o?.phoneNumber) || o?.name)
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    required: false,
    maximum: 255,
    description: 'E-mail',
  })
  @ValidateIf((o) => (!o?.name && !o?.phoneNumber) || o?.email)
  @IsEmail()
  @MaxLength(255)
  email: string;
}
