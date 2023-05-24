import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetCardWithdrawalSettingDto {
  @ApiProperty({ example: 123, description: 'Amount of money to be withdrawed' })
  @IsNumber()
  desiredAmount: number;
}
