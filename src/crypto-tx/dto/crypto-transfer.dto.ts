import { ApiProperty } from '@nestjs/swagger';
import {
  MaxLength,
  IsString,
  IsNumber,
  IsEnum,
  MinLength,
} from 'class-validator';
import { FIAT_CURRENCY_NAME } from '../crypto-tx.entity';

export class CryptoTransferDto {
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
    example: 'johndoe@example.com',
    required: true,
    maximum: 255,
    description: 'Email address, phone number or Keecash ID',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  receiver: string;

  @ApiProperty({
    example: 'I do that for my family',
    required: true,
    maximum: 255,
    description: 'Description',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  description: string;
}
