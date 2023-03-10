import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength } from 'class-validator';
import { FiatCurrencyEnum } from '../crypto-tx.types';

export class CryptoConfirmCancelWithdrawDto {
  @ApiProperty({
    example: 'AGJ-937870-PYT',
    required: true,
    maximum: 255,
    description: 'Payment reference',
  })
  @IsString()
  @MaxLength(255)
  payout_reference: string;

  @ApiProperty({
    example: 'USD',
    required: true,
    maximum: 255,
    description: 'Currency Name',
  })
  @IsEnum(FiatCurrencyEnum)
  currency_name: FiatCurrencyEnum;
}
