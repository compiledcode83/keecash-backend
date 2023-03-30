import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { CardTypeEnum } from '../card.types';

export class GetCreateCardTotalFeeDto {
  @ApiProperty({ example: CardTypeEnum.Multiple, description: 'Type of card to be created' })
  @IsEnum(CardTypeEnum)
  cardType: CardTypeEnum;

  @ApiProperty({ example: 123, description: 'Amount of money to be topped up' })
  @IsNumber()
  desiredAmount;
}
