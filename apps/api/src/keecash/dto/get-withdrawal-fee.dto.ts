import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@app/common';

export class GetWithdrawalFeeDto {
  @ApiProperty({ example: FiatCurrencyEnum.EUR, description: 'Keecash wallet address' })
  @IsEnum(FiatCurrencyEnum)
  keecash_wallet: FiatCurrencyEnum;

  @ApiProperty({ example: CryptoCurrencyEnum.BTC, description: 'Withdrawal method' })
  @IsEnum(CryptoCurrencyEnum)
  withdrawal_method: CryptoCurrencyEnum;

  @ApiProperty({ example: 100, description: 'Withdrawal amount in fiat (EUR, USD ...)' })
  @IsNumber()
  fiat_amount: number;

  @ApiProperty({ example: 0.032, description: 'Withdrawal amount in crypto (BTC, ETH ...)' })
  @IsNumber()
  crypto_amount: number;
}
