import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { FIAT_CURRENCY_NAME } from '../crypto-tx.entity';

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
  @IsEnum(FIAT_CURRENCY_NAME)
  currency_name: FIAT_CURRENCY_NAME;
}
