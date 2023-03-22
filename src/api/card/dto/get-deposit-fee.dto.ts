import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetDepositFeeDto {
  @ApiProperty({ example: '', description: 'Keecash wallet address' })
  @IsString()
  keecash_wallet: string;

  @ApiProperty({ example: '', description: 'Deposit method' })
  @IsString()
  deposit_method: string;

  @ApiProperty({ example: '', description: 'Deposit reason' })
  @IsString()
  reason: string;

  @ApiProperty({ example: 100, description: 'Deposit number' })
  @IsNumber()
  desired_amount: number;

  @ApiProperty({ example: '', description: 'Currency' })
  @IsString()
  currency: string; // EUR,USD,BTC,ETH..
}
