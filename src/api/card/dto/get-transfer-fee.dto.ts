import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetTransferFeeDto {
  @ApiProperty({ example: '', description: 'Keecash wallet address' })
  @IsString()
  keecash_wallet: string;

  @ApiProperty({ example: '', description: 'Transfer reason' })
  @IsString()
  reason: string;

  @ApiProperty({ example: 100, description: 'Transfer number' })
  @IsNumber()
  desired_amount: number;

  @ApiProperty({ example: '', description: 'Currency' })
  @IsString()
  currency: string; // EUR,USD,BTC,ETH..
}
