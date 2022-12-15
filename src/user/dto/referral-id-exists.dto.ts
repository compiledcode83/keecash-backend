import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, Validate } from 'class-validator';
import { ReferralIdExistsValidator } from '../validator/referral-id-exists.validator';

export class ReferralIdExistsDto {
  @ApiProperty({
    example: 'CXONS91',
    required: true,
    minimum: 1,
    maximum: 128,
    description: 'Referral id to apply',
  })
  @IsString()
  @Validate(ReferralIdExistsValidator)
  @MinLength(1)
  @MaxLength(128)
  referralAppliedId: string;
}
