import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { AccountType, Language, UserStatus } from '@src/user/user.types';

export class UpdateUserInfoDto {
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
  address1: string;

  @ApiProperty({ description: 'Address', maximum: 64, required: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  address2: string;

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
  @IsEnum(UserStatus)
  status: UserStatus;

  @ApiProperty({
    description: 'Language',
    maximum: 255,
    required: true,
  })
  @IsOptional()
  @IsEnum(Language)
  language: Language;

  @ApiProperty({ description: 'User ID' })
  @IsInt()
  userId: number;
}
