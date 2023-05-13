import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsString } from 'class-validator';
import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@api/transaction/transaction.types';

export class GetDepositFeeDto {
  @ApiProperty({ example: 'EUR', description: 'Keecash wallet currency selected' })
  @IsEnum(FiatCurrencyEnum)
  keecash_wallet: FiatCurrencyEnum;

  @ApiProperty({ example: CryptoCurrencyEnum.BTC, description: 'Deposit method selected' })
  @IsEnum(CryptoCurrencyEnum)
  deposit_method: CryptoCurrencyEnum;

  @ApiProperty({ example: 100, description: 'Deposit amount in fiat (EUR, USD ...)' })
  @IsNumberString()
  desired_amount: string;
}
