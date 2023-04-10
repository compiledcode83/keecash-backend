import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { CardUsageEnum } from '../card.types';

export class GetCreateCardTotalFeeDto {
  @ApiProperty({ example: CardUsageEnum.Multiple, description: 'Type of card usage to be created' })
  @IsEnum(CardUsageEnum)
  cardType: CardUsageEnum;

  @ApiProperty({ example: 123, description: 'Amount of money to be topped up' })
  @IsNumber()
  desiredAmount: number;
}
