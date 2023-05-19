import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetCardTopupSettingDto {
  @ApiProperty({ example: '70b34986c13c4026a9c160eabc49', description: 'Card ID' })
  @IsString()
  bridgecardId: string;

  @ApiProperty({ example: 123, description: 'Amount of money to be topped up' })
  @IsNumber()
  desiredAmount: number;
}
