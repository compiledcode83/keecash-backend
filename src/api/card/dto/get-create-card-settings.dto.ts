import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { FiatCurrencyEnum } from '@src/api/crypto-tx/crypto-tx.types';

export class GetCreateCardSettingsDto {
  @ApiProperty({ example: FiatCurrencyEnum.EUR, description: 'Keecash wallet currency' })
  @IsEnum(FiatCurrencyEnum)
  currency: FiatCurrencyEnum;
}
