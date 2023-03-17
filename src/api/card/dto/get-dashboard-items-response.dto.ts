import { ApiProperty } from '@nestjs/swagger';
import { FiatCurrencyEnum } from '@src/api/crypto-tx/crypto-tx.types';
import { IsArray, IsBoolean, IsEnum } from 'class-validator';

export class GetDashboardItemsDto {
  @ApiProperty({ example: true, description: 'Is reading dashboard success' })
  @IsBoolean()
  isSuccess: boolean;

  @ApiProperty({ description: 'List of wallets' })
  @IsArray()
  wallets: object;

  @ApiProperty({ example: FiatCurrencyEnum.EUR, description: 'Recommended currency' })
  @IsEnum(FiatCurrencyEnum)
  recommended: FiatCurrencyEnum;
}
