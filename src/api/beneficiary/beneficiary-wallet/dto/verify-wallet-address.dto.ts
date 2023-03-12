import { ApiProperty } from '@nestjs/swagger';
import { CryptoCurrencyEnum } from '@api/crypto-tx/crypto-tx.types';
import { IsEnum, IsString } from 'class-validator';

export class VerifyWalletAddressDto {
  @ApiProperty({
    example: 'TDUouyRW3whZrDm1RjNY1WfikC2Y73rPGw',
    required: true,
    maximum: 255,
    description: 'Wallet address',
  })
  @IsString()
  cryptoAddress: string;

  @ApiProperty({
    example: 'USDT',
    required: true,
    maximum: 255,
    description: 'Cryptocurrency / chain name',
  })
  @IsEnum(CryptoCurrencyEnum)
  blockchain: CryptoCurrencyEnum;
}
