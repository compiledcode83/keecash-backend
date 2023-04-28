import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ApplyCardWithdrawalDto {
  @ApiProperty({ example: '70b34986c13c4026a9c160eabc49', description: 'Card ID' })
  @IsString()
  bridgecardId: string;

  @ApiProperty({ example: 20, description: 'Card withdrawal amount' })
  @IsNumber()
  withdrawalAmount: number;
}
