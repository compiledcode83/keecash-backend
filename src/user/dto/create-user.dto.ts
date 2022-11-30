import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { AccountType, Language } from '../user.entity';
import { UserExistsByEmailValidator } from '../validator/user-exists-by-email.validator';
import { UserExistsByPhoneNumberValidator } from '../validator/user-exists-by-phone-number.validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    required: true,
    minimum: 1,
    maximum: 128,
    description: 'Full name',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  name: string;

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
    example: 'Phone Number',
    required: true,
    maximum: 255,
    description: '+XXXXXXXXXXX',
  })
  @IsPhoneNumber()
  @Validate(UserExistsByPhoneNumberValidator)
  phoneNumber: string;

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
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    required: true,
    maximum: 255,
    description: 'Token for email',
  })
  @IsString()
  @MinLength(1)
  emailToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    required: true,
    maximum: 255,
    description: 'Token for phone Number',
  })
  @IsString()
  @MinLength(1)
  phoneNumberToken: string;

  @ApiProperty({
    description: 'Language',
    maximum: 255,
    required: true,
  })
  @IsEnum(Language)
  language: Language;

  @ApiProperty({
    description: 'Language',
    maximum: 255,
    required: true,
  })
  @IsEnum(AccountType)
  accountType: AccountType;
}
