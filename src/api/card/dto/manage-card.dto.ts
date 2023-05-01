import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ManageCardDto {
  @ApiProperty({ example: '70b34986c13c4026a9c160eabc49', description: 'Card ID' })
  @IsString()
  card_id: string;
}
