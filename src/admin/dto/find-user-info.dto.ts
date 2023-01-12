import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class FindUserInfoDto {
  @ApiProperty({
    example: 'user@example.com',
    required: true,
    maximum: 255,
    description: 'User ID(email, phone number, referral id)',
  })
  @MaxLength(255)
  userId: string;
}
