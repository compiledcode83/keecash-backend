import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean } from 'class-validator';

export class GetCardsResponseDto {
  @ApiProperty({ example: true, description: 'Is reading dashboard success' })
  @IsBoolean()
  isSuccess: boolean;

  @ApiProperty({ description: 'List of wallets' })
  @IsArray()
  myCards: object;
}
