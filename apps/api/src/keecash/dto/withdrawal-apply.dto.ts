import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@app/common';
import { UserAccessTokenInterface } from '@api/auth/auth.type';

export class WithdrawalApplyDto {
  @ApiProperty({ example: FiatCurrencyEnum.EUR, description: 'Keecash wallet' })
  @IsEnum(FiatCurrencyEnum)
  keecash_wallet: FiatCurrencyEnum;

  @ApiProperty({ example: CryptoCurrencyEnum.BTC, description: 'Withdrawal method' })
  @IsEnum(CryptoCurrencyEnum)
  withdrawal_method: CryptoCurrencyEnum;

  @ApiProperty({ example: 'For my family', description: 'Reason' })
  @IsString()
  reason: string;

  @ApiProperty({ example: 20, description: 'Desired amount' })
  @IsNumber()
  target_amount: number;

  @ApiProperty({ example: true, description: 'Option that whether you save it as a beneficiary' })
  @IsBoolean()
  to_save_as_beneficiary: boolean;

  @ApiProperty({ example: 'My Binance account', description: 'Wallet name' })
  @IsOptional()
  @IsString()
  wallet_name: string;

  @ApiProperty({ example: '0x8078****cdE37C7bbB86', description: 'Wallet address' })
  @IsString()
  wallet_address: string;

  @IsNotEmpty()
  user: UserAccessTokenInterface;
}
