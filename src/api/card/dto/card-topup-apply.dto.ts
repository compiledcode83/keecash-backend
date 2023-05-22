import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ApplyCardTopupDto {
  @ApiProperty({ example: 20, description: 'Card topup amount' })
  @IsNumber()
  topupAmount: number;
}
