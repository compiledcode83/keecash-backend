import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ApplyCardTopupDto {
  @ApiProperty({ example: 4, description: 'Card ID' })
  @IsNumber()
  cardId: number;

  @ApiProperty({ example: 20, description: 'Card topup amount' })
  @IsNumber()
  topupAmount: number;
}
