import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';
import { CardUsageEnum } from '../card.types';

export class GetCardTopupSettingDto {
  @ApiProperty({ example: FiatCurrencyEnum.EUR, description: 'Keecash wallet currency' })
  @IsEnum(FiatCurrencyEnum)
  currency: FiatCurrencyEnum;

  @ApiProperty({ example: CardUsageEnum.Multiple, description: 'Card usage type' })
  @IsEnum(CardUsageEnum)
  card_usage: CardUsageEnum;
}
