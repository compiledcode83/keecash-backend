import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@app/common';
import { UserAccessTokenInterface } from '@api/auth/auth.type';

export class DepositPaymentLinkDto {
  @ApiProperty({ example: FiatCurrencyEnum.EUR, description: 'Keecash wallet' })
  @IsEnum(FiatCurrencyEnum)
  keecash_wallet: FiatCurrencyEnum;

  @ApiProperty({ example: CryptoCurrencyEnum.BTC, description: 'Deposit method' })
  @IsEnum(CryptoCurrencyEnum)
  deposit_method: CryptoCurrencyEnum;

  @ApiProperty({ example: 'For chill', description: 'Reason' })
  @IsString()
  reason: string;

  @ApiProperty({ example: 100, description: 'Desired amount' })
  @IsNumber()
  desired_amount: number;

  @IsNotEmpty()
  user: UserAccessTokenInterface;
}
