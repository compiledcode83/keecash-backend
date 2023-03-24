import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ManageCardDto {
  @ApiProperty({ example: 10, description: 'Id of card to be blocked / unlocked / removed' })
  @IsInt()
  cardId: number;
}
