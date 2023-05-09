import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { CryptoCurrencyEnum } from '@app/transaction/transaction.types';

export class VerifyWalletAddressDto {
  @ApiProperty({ example: 'TDUouyRW3whZrDm1RjNY1', required: true, description: 'Address' })
  @IsString()
  cryptoAddress: string;

  @ApiProperty({ example: 'BTC', required: true, description: 'Cryptocurrency / chain name' })
  @IsEnum(CryptoCurrencyEnum)
  blockchain: CryptoCurrencyEnum;
}
