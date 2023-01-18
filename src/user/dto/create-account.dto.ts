import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  Validate,
  IsOptional,
} from 'class-validator';
import { Language } from '../table/user.entity';
import { ReferralIdExistsValidator } from '../validator/referral-id-exists.validator';
import { UserExistsByEmailValidator } from '../validator/user-exists-by-email.validator';

export class CreateAccountDto {
  @ApiProperty({
    example: 'NV383',
    required: true,
    minimum: 1,
    maximum: 128,
    description: 'Referral Applied ID',
  })
  @IsString()
  @IsOptional()
  @Validate(ReferralIdExistsValidator)
  @MinLength(1)
  @MaxLength(128)
  referralAppliedId: string;

  @ApiProperty({
    example: 'user@example.com',
    required: true,
    maximum: 255,
    description: 'E-mail',
  })
  @IsEmail()
  @MaxLength(255)
  @Validate(UserExistsByEmailValidator)
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
    description: 'Language',
    maximum: 255,
    required: true,
  })
  @IsEnum(Language)
  language: Language;
}
