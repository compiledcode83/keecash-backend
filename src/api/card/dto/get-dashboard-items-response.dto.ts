import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum } from 'class-validator';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';

export class GetDashboardItemsResponseDto {
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
