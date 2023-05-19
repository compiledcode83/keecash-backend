import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { CardUsageEnum } from '../card.types';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';

export class GetCreateCardTotalFeeDto {
  @ApiProperty({ example: FiatCurrencyEnum.EUR, description: 'Keecash wallet currency' })
  @IsEnum(FiatCurrencyEnum)
  currency: FiatCurrencyEnum;

  @ApiProperty({ example: CardUsageEnum.Multiple, description: 'Type of card usage to be created' })
  @IsEnum(CardUsageEnum)
  cardUsageType: CardUsageEnum;

  @ApiProperty({ example: 123, description: 'Amount of money to be topped up' })
  @IsNumber()
  desiredAmount: number;
}
