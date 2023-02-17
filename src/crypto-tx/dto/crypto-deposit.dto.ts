import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { FiatCurrencyEnum } from '../crypto-tx.types';

export class CryptoDepositDto {
  @ApiProperty({
    example: '10.0',
    required: true,
    maximum: 255,
    description: 'Deposit Amount',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'USD',
    required: true,
    maximum: 255,
    description: 'Currency Name',
  })
  @IsEnum(FiatCurrencyEnum)
  currency_name: FiatCurrencyEnum;
}
