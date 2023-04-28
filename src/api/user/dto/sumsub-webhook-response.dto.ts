import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SumsubWebhookResponseDto {
  @ApiProperty({ example: 1, required: true, description: 'ID of user verified by Sumsub' })
  @IsNumber()
  userId: number;
}
