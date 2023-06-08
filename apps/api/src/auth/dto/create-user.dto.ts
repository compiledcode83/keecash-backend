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
import { Language } from '@app/user/user.types';
import { ReferralIdExistsValidator } from '@api/user/validator/referral-id-exists.validator';
import { UserExistsByEmailValidator } from '@api/user/validator/user-exists-by-email.validator';
import { LegitEmailValidator } from '@api/user/validator/legit-email.validator';

export class CreateUserDto {
  @ApiProperty({ example: 'NV383SB', required: true, maximum: 128, description: `Refer's ID` })
  @IsString()
  @IsOptional()
  @Validate(ReferralIdExistsValidator)
  referralAppliedId: string;

  @ApiProperty({ example: 'user@example.com', required: true, maximum: 255, description: 'E-mail' })
  @IsEmail()
  @MaxLength(255)
  @Validate(LegitEmailValidator)
  @Validate(UserExistsByEmailValidator)
  email: string;

  @ApiProperty({ example: 'password123!@#', required: true, maximum: 255, description: 'Password' })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;

  @ApiProperty({ example: 'en', description: 'Language', maximum: 255, required: true })
  @IsEnum(Language)
  language: Language;
}
