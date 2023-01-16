import { ApiProperty } from '@nestjs/swagger';
import { AccountType, Language, Status } from '@src/user/table/user.entity';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserInfoDto {
  @ApiProperty({
    example: 'user@example.com',
    required: true,
    maximum: 255,
    description: 'Email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'John',
    required: true,
    minimum: 1,
    maximum: 128,
    description: 'First name',
  })
  @IsOptional()
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
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  secondName: string;

  @ApiProperty({ description: 'Address', maximum: 64, required: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  address: string;

  @ApiProperty({ description: 'zipcode', maximum: 64, required: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  zipcode: string;

  @ApiProperty({ description: 'city', maximum: 64, required: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  city: string;

  @ApiProperty({
    description: 'Language',
    maximum: 255,
    required: true,
  })
  @IsOptional()
  @IsEnum(AccountType)
  accountType: AccountType;

  @ApiProperty({
    description: 'Status',
    maximum: 255,
    required: true,
  })
  @IsOptional()
  @IsEnum(Status)
  status: Status;

  @ApiProperty({
    description: 'Language',
    maximum: 255,
    required: true,
  })
  @IsOptional()
  @IsEnum(Language)
  language: Language;
}
