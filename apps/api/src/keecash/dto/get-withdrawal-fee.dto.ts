import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumberString } from 'class-validator';
import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@app/common';
import { UserAccessTokenInterface } from '@api/auth/auth.type';

export class GetWithdrawalFeeDto {
  @ApiProperty({ example: FiatCurrencyEnum.EUR, description: 'Keecash wallet address' })
  @IsEnum(FiatCurrencyEnum)
  keecash_wallet: FiatCurrencyEnum;

  @ApiProperty({ example: CryptoCurrencyEnum.BTC, description: 'Withdrawal method' })
  @IsEnum(CryptoCurrencyEnum)
  withdrawal_method: CryptoCurrencyEnum;

  @ApiProperty({ example: 100, description: 'Withdrawal amount in fiat (EUR, USD ...)' })
  @IsNumberString()
  fiat_amount: string;

  @IsNotEmpty()
  user: UserAccessTokenInterface;
}
