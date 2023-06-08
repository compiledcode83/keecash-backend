import { ApiProperty } from '@nestjs/swagger';
<<<<<<< HEAD:apps/api/src/keecash/dto/get-deposit-fee.dto.ts
import { IsEnum, IsNotEmpty, IsNumberString } from 'class-validator';
import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@app/common';
import { UserAccessTokenInterface } from '@api/auth/auth.type';
=======
import { IsEnum, IsNumber, IsNumberString, IsString } from 'class-validator';
import { CryptoCurrencyEnum, FiatCurrencyEnum } from '@api/transaction/transaction.types';
>>>>>>> 381621e06e83efe140d01ba95f21884ffdfb849c:src/api/card/dto/get-deposit-fee.dto.ts

export class GetDepositFeeDto {
  @ApiProperty({ example: 'EUR', description: 'Keecash wallet currency selected' })
  @IsEnum(FiatCurrencyEnum)
  keecash_wallet: FiatCurrencyEnum;

  @ApiProperty({ example: CryptoCurrencyEnum.BTC, description: 'Deposit method selected' })
  @IsEnum(CryptoCurrencyEnum)
  deposit_method: CryptoCurrencyEnum;

  @ApiProperty({ example: 100, description: 'Deposit amount in fiat (EUR, USD ...)' })
<<<<<<< HEAD:apps/api/src/keecash/dto/get-deposit-fee.dto.ts
  @IsNumberString()
  fiat_amount: string;

  @IsNotEmpty()
  user: UserAccessTokenInterface;
=======
  @IsNumber()
  desired_amount: number;
>>>>>>> 381621e06e83efe140d01ba95f21884ffdfb849c:src/api/card/dto/get-deposit-fee.dto.ts
}
