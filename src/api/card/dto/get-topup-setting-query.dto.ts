import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CardUsageEnum } from '../card.types';

export class GetTopupSettingQueryDto {
  @ApiProperty({ example: CardUsageEnum.Multiple, description: 'Type of card usage to be created' })
  @IsOptional()
  @IsEnum(CardUsageEnum)
  cardUsageType: CardUsageEnum;
}
