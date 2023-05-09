import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';
import { User } from '@app/user';

export class GetReferralResponseDto {
  @ApiProperty({ example: 1, required: true, description: 'User ID of referral' })
  @IsInt()
  referral_id: string;

  @ApiProperty({ required: true, description: 'Array of referred users' })
  @IsArray()
  godsons: Partial<User>[];
}
