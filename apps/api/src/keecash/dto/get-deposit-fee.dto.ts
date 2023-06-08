import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumberString } from 'class-validator';
import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@app/common';
import { UserAccessTokenInterface } from '@api/auth/auth.type';

export class GetDepositFeeDto {
  @ApiProperty({ example: 'EUR', description: 'Keecash wallet address' })
  @IsEnum(FiatCurrencyEnum)
  keecash_wallet: FiatCurrencyEnum;

  @ApiProperty({ example: CryptoCurrencyEnum.BTC, description: 'Deposit method' })
  @IsEnum(CryptoCurrencyEnum)
  deposit_method: CryptoCurrencyEnum;

  @ApiProperty({ example: 100, description: 'Deposit amount in fiat (EUR, USD ...)' })
  @IsNumberString()
  fiat_amount: string;

  @IsNotEmpty()
  user: UserAccessTokenInterface;
}
