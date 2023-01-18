import { ApiProperty } from '@nestjs/swagger';
import {
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { CountryExistsByNameValidator } from '../validator/country-exists-by-name.validator';

export class SendPhoneNumberVerificationCodeDto {
  @ApiProperty({
    example: '+XXXXXXXXXXX',
    required: true,
    maximum: 255,
    description: 'Phone number',
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ description: 'country', maximum: 64, required: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @Validate(CountryExistsByNameValidator)
  country: string;
}
