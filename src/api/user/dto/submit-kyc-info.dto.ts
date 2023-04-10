import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength, Validate } from 'class-validator';
import { CountryExistsByNameValidator } from '../validator/country-exists-by-name.validator';

export class SubmitKycInfoDto {
  @ApiProperty({ example: 'John', required: true, minimum: 1, description: 'First name' })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ example: 'Doe', required: true, minimum: 1, description: 'Second name' })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty({ description: 'Address 1', maximum: 64, required: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  address1: string;

  @ApiProperty({ description: 'Address 2', maximum: 64, required: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  address2?: string;

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
}
