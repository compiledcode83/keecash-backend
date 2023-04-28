import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@api/transaction/transaction.types';

export class DepositPaymentLinkDto {
  @ApiProperty({ example: FiatCurrencyEnum.EUR, description: 'Keecash wallet' })
  @IsEnum(FiatCurrencyEnum)
  keecash_wallet: FiatCurrencyEnum;

  @ApiProperty({ example: CryptoCurrencyEnum.BTC, description: 'Deposit method' })
  @IsEnum(CryptoCurrencyEnum)
  deposit_method: CryptoCurrencyEnum;

  @ApiProperty({ example: 'For chill', description: 'Reason' })
  @IsString()
  reason: string;

  @ApiProperty({ example: 100, description: 'Desired amount' })
  @IsNumber()
  desired_amount: number;

  @ApiProperty({ example: 200, description: 'Total to pay' })
  @IsNumber()
  total_to_pay: number;

  @ApiProperty({ example: 1.26, description: 'Applied fee' })
  @IsNumber()
  applied_fee: number;

  @ApiProperty({ example: 0.99, description: 'Fixed fee' })
  @IsNumber()
  fixed_fee: number;

  @ApiProperty({ example: 1.5, description: 'Percentage fee' })
  @IsNumber()
  percent_fee: number;
}
