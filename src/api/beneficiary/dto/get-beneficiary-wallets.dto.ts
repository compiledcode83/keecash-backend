import { ApiProperty } from '@nestjs/swagger';
import { CryptoCurrencyEnum } from '@api/transaction/transaction.types';
import { IsEnum } from 'class-validator';

export class GetBeneficiaryWalletsDto {
  @ApiProperty({ example: CryptoCurrencyEnum.BTC, description: 'Cryptocurrency name' })
  @IsEnum(CryptoCurrencyEnum)
  currency: CryptoCurrencyEnum;
}
