import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CryptoCurrencyEnum } from '@app/common';

export class GetBeneficiaryWalletsDto {
  @ApiProperty({ example: CryptoCurrencyEnum.BTC, description: 'Cryptocurrency name' })
  @IsEnum(CryptoCurrencyEnum)
  currency: CryptoCurrencyEnum;
}
