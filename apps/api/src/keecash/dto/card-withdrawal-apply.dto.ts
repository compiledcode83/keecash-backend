import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ApplyCardWithdrawalDto {
  @ApiProperty({ example: 20, description: 'Card withdrawal amount' })
  @IsNumber()
  withdrawalAmount: number;
}
