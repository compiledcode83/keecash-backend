import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetCardTopupSettingDto {
  @ApiProperty({ example: 123, description: 'Amount of money to be topped up' })
  @IsNumber()
  desiredAmount: number;
}
