import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { FiatCurrencyEnum } from 'libs/transaction/src/transaction.types';

export class GetCreateCardSettingsDto {
  @ApiProperty({
    example: FiatCurrencyEnum.EUR,
    description: 'Keecash wallet currency',
    required: true,
  })
  @IsEnum(FiatCurrencyEnum)
  currency: FiatCurrencyEnum;
}
