import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class DepositPaymentLinkDto {
  @ApiProperty({ example: '', description: 'Keecash wallet' })
  @IsString()
  keecash_wallet: string;

  @ApiProperty({ example: '', description: 'Deposit method' })
  @IsString()
  deposit_method: string;

  @ApiProperty({ example: '', description: 'Reason' })
  @IsString()
  reason: string;

  @ApiProperty({ example: 100, description: 'Desired amount' })
  @IsNumber()
  desired_amount: number;

  @ApiProperty({ example: '', description: 'Currency' })
  @IsString()
  currency: string;

  @ApiProperty({ example: 200, description: 'Total to pay' })
  @IsNumber()
  total_to_pay: number;
}
