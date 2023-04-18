import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, MaxLength } from 'class-validator';

export class AddBeneficiaryUserDto {
  @ApiProperty({ example: 1, required: true, description: 'Beneficiary user id' })
  @IsNumber()
  @MaxLength(255)
  beneficiaryUserId: number;
}
