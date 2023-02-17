import { ApiProperty } from '@nestjs/swagger';
import { CountryExistsByNameValidator } from '@src/user/validator/country-exists-by-name.validator';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { AdminTypeEnum } from '../admin.types';

export class AddAdminDto {
  @ApiProperty({
    example: 'user@example.com',
    required: true,
    maximum: 255,
    description: 'E-mail',
  })
  @IsEmail()
  @MaxLength(255)
  email: string;

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

  @ApiProperty({
    example: 'password123!@#',
    required: true,
    maximum: 255,
    description: 'Password',
  })
  @IsEnum(AdminTypeEnum)
  type: AdminTypeEnum;

  @ApiProperty({ description: 'country', maximum: 64, required: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @IsOptional()
  @Validate(CountryExistsByNameValidator)
  country: string;
}
