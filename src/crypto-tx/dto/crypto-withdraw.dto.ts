import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CRYTPO_CURRENCY_NAME, FIAT_CURRENCY_NAME } from '../crypto-tx.entity';

export class CryptoWithdrawDto {
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
    description: 'Fiat Currency Name',
  })
  @IsEnum(FIAT_CURRENCY_NAME)
  currency_name: FIAT_CURRENCY_NAME;

  @ApiProperty({
    example: 'BTC',
    required: true,
    maximum: 255,
    description: 'Crypto Currency Name',
  })
  @IsEnum(CRYTPO_CURRENCY_NAME)
  crypto_currency_name: CRYTPO_CURRENCY_NAME;

  @ApiProperty({
    example: 'mtzozh***************xZ18Ggc00hbf',
    required: true,
    maximum: 255,
    description: 'Wallet address',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  address: string;

  @ApiProperty({
    example: 'The Keecash Client',
    required: true,
    maximum: 255,
    description: 'Merchant  name',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'Cameroon',
    required: true,
    maximum: 255,
    description: 'ISO 3166 alpha 2 country code',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  country: string;
}
