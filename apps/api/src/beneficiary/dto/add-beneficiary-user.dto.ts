import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, MaxLength } from 'class-validator';
import { BeneficiaryUserIdValidator } from '../validators/beneficiary-user-id.validator';

export class AddBeneficiaryUserDto {
  @ApiProperty({ example: 1, required: true, description: 'Beneficiary user id' })
  @IsNumber()
  @IsPositive()
  @BeneficiaryUserIdValidator(1, 255)
  beneficiaryUserId: number;
}
