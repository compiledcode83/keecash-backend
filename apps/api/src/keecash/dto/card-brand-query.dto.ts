import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { CardBrandEnum } from '../card.types';

export class CardBrandQueryDto {
  @ApiProperty({
    example: CardBrandEnum.Mastercard,
    description: 'Type of card usage to be created',
  })
  @IsOptional()
  @IsEnum(CardBrandEnum)
  cardBrand: CardBrandEnum;
}
