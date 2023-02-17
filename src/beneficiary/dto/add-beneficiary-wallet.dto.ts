import { ApiProperty } from '@nestjs/swagger';
import { CryptoCurrencyEnum } from '@src/crypto-tx/crypto-tx.types';
import { IsEnum, IsString, MaxLength } from 'class-validator';

export class AddBeneficiaryWalletDto {
  @ApiProperty({
    example: 'TDUouyRW3whZrDm1RjNY1WfikC2Y73rPGw',
    required: true,
    maximum: 255,
    description: 'Wallet address',
  })
  @IsString()
  @MaxLength(255)
  address: string;

  @ApiProperty({
    example: 'Bitcoin wallet',
    required: true,
    maximum: 255,
    description: 'Wallet name',
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'USDT',
    required: true,
    maximum: 255,
    description: 'Cryto currency Name',
  })
  @IsEnum(CryptoCurrencyEnum)
  type: CryptoCurrencyEnum;
}
