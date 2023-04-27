import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class GetCardTopupSettingDto {
  @ApiProperty({ example: 1, description: 'Card ID' })
  @IsNumberString()
  cardId: number;

  @ApiProperty({ example: 123, description: 'Amount of money to be topped up' })
  @IsNumberString()
  desiredAmount: string;
}
