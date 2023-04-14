import { ApiProperty } from '@nestjs/swagger';
import { CryptoCurrencyEnum } from '@api/transaction/transaction.types';
import { IsEnum, IsString } from 'class-validator';

export class VerifyWalletAddressDto {
  @ApiProperty({ example: 'TDUouyRW3whZrDm1RjNY1', required: true, description: 'Address' })
  @IsString()
  cryptoAddress: string;

  @ApiProperty({ example: 'BTC', required: true, description: 'Cryptocurrency / chain name' })
  @IsEnum(CryptoCurrencyEnum)
  blockchain: CryptoCurrencyEnum;
}
