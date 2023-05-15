import { IsNotEmpty, IsString } from 'class-validator';
import { UserAccessTokenInterface } from '@api/auth/auth.type';

export class ManageCardDto {
  @IsNotEmpty()
  user: UserAccessTokenInterface;

  @IsString()
  cardId: string;
}
