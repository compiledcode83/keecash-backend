import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  Validate,
  IsPhoneNumber,
} from 'class-validator';
import { DOCUEMNT_TYPE } from '../table/document.entity';
import { AccountType, Language } from '../table/user.entity';
import { CountryExistsByNameValidator } from '../validator/country-exists-by-name.validator';
import { UserExistsByEmailValidator } from '../validator/user-exists-by-email.validator';
import { UserExistsByPhoneNumberValidator } from '../validator/user-exists-by-phone-number.validator';

export class CreatePersonProfileDto {
  @ApiProperty({
    example: 'John',
    required: true,
    minimum: 1,
    maximum: 128,
    description: 'First name',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    required: true,
    minimum: 1,
    maximum: 128,
    description: 'Second name',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  secondName: string;

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
    description: 'Account Type',
    maximum: 255,
    required: true,
  })
  @IsEnum(AccountType)
  accountType: AccountType;

  @ApiProperty({ description: 'Address1', maximum: 64, required: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  address1: string;

  @ApiProperty({ description: 'address2', maximum: 64, required: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  address2: string;

  @ApiProperty({ description: 'zipcode', maximum: 64, required: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  zipcode: string;

  @ApiProperty({ description: 'city', maximum: 64, required: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  city: string;

  @ApiProperty({ description: 'country', maximum: 64, required: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @Validate(CountryExistsByNameValidator)
  country: string;

  @ApiProperty({
    description: 'Document Type',
    maximum: 255,
    required: true,
  })
  @IsEnum(DOCUEMNT_TYPE)
  documentType: DOCUEMNT_TYPE;
}
