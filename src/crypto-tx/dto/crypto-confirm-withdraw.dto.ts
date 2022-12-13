import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CryptoConfirmCancelWithdrawDto {
  @ApiProperty({
    example: 'AGJ-937870-PYT',
    required: true,
    maximum: 255,
    description: 'Payment reference',
  })
  @IsString()
  @MaxLength(255)
  payout_reference: string;
}
