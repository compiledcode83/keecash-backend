import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class AddBeneficiaryUserDto {
  @ApiProperty({
    example: 'jhon.doe@example.com',
    required: true,
    maximum: 255,
    description: 'Beneficiary user email, phonenumber or referral id',
  })
  @IsString()
  @MaxLength(255)
  beneficiaryUser: string;
}
