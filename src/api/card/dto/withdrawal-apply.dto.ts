import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class WithdrawalApplyDto {
  @ApiProperty({ example: '', description: 'Keecash wallet' })
  @IsString()
  keecash_wallet: string;

  @ApiProperty({ example: '', description: 'Withdrawal method' })
  @IsString()
  withdrawal_method: string;

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
  @IsString()
  total_to_pay: number;
}
