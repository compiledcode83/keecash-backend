import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class TransferApplyDto {
  @ApiProperty({ example: '', description: 'Keecash wallet' })
  @IsString()
  keecash_wallet: string;

  @ApiProperty({ example: '', description: 'Reason' })
  @IsString()
  reason: string;

  @ApiProperty({ example: 100, description: 'Desired amount' })
  @IsNumber()
  @IsString()
  desired_amount: number;

  @ApiProperty({ example: '', description: 'Currency' })
  @IsString()
  currency: string;

  @ApiProperty({ example: 200, description: 'Total to pay' })
  @IsNumber()
  total_to_pay: number;

  @ApiProperty({ example: true, description: 'Option that whether you save it as a beneficiary' })
  @IsBoolean()
  to_save_as_beneficiary: boolean;

  @ApiProperty({ example: true, description: 'Address' })
  @IsString()
  address: string;
}
