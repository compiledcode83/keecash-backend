import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  Validate,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { DOCUEMNT_TYPE } from '../table/document.entity';
import { Position } from '../table/enterprise-profile.entity';
import { Language } from '../table/user.entity';
import { CountryExistsByNameValidator } from '../validator/country-exists-by-name.validator';
import { ReferralIdExistsValidator } from '../validator/referral-id-exists.validator';
import { UserExistsByEmailValidator } from '../validator/user-exists-by-email.validator';
import { CreateShareholderDto } from './create-shareholder.dto';

export class CreateEnterpriseUserDto {
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
    example: 'Doe',
    required: true,
    minimum: 1,
    maximum: 128,
    description: 'Second name',
  })
  @IsString()
  @IsOptional()
  @Validate(ReferralIdExistsValidator)
  @MinLength(1)
  @MaxLength(128)
  referralAppliedId?: string;

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
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    required: true,
    maximum: 255,
    description: 'Token for email',
  })
  @IsString()
  @MinLength(1)
  emailToken: string;

  @ApiProperty({
    description: 'Language',
    maximum: 255,
    required: true,
  })
  @IsEnum(Language)
  language: Language;

  @ApiProperty({
    description: 'Enterprise user position',
    maximum: 255,
    required: true,
  })
  @IsEnum(Position)
  position: Position;

  @ApiProperty({ description: 'Entity Type', maximum: 64, required: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  entityType: string;

  @ApiProperty({ description: 'Company name', maximum: 64, required: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  companyName: string;

  @ApiProperty({
    description: 'Company registeration number',
    maximum: 64,
    required: true,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  companyRegisterationNumber: string;

  @ApiProperty({
    description: 'Company registeration number',
    maximum: 64,
    required: true,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  vatNumber: string;

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

  @ApiProperty({ description: 'country', maximum: 64, required: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateShareholderDto)
  shareholders: CreateShareholderDto[];

  @ApiProperty({
    description: 'Verification Image Link',
    maximum: 64,
    required: true,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  verificationImageLink: string;

  @ApiProperty({
    description: 'UBO Image Link',
    maximum: 64,
    required: true,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  uboImageLink: string;

  @ApiProperty({
    description: 'Company Registeration Image Link',
    maximum: 64,
    required: true,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  companyRegisterationImageLink: string;

  @ApiProperty({
    description: 'Document Type',
    maximum: 255,
    required: true,
  })
  @IsEnum(DOCUEMNT_TYPE)
  documentType: DOCUEMNT_TYPE;
}
