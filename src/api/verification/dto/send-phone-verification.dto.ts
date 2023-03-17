import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, MaxLength, MinLength, Validate } from 'class-validator';
import { CountryExistsByNameValidator } from '../../user/validator/country-exists-by-name.validator';

export class SendPhoneNumberVerificationCodeDto {
  @ApiProperty({ example: '+1234567890', required: true, description: 'Phone number' })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ example: 'United States', description: 'country', required: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @Validate(CountryExistsByNameValidator)
  country: string;
}
