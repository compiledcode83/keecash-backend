import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsString } from 'class-validator';

export class TripleAWithdrawalNotifyDto {
  @ApiProperty({
    example: 'AGJ-937870-PYT',
    required: true,
    maximum: 255,
    description: 'Payout reference',
  })
  @IsString()
  @MaxLength(255)
  payout_reference: string;

  @ApiProperty({
    example: '3ffgdjf',
    required: true,
    maximum: 255,
    description: 'Order id',
  })
  @IsString()
  @MaxLength(255)
  order_id: string;

  @ApiProperty({
    example: 'USD',
    required: true,
    maximum: 255,
    description: 'Currency name',
  })
  @IsString()
  @MaxLength(255)
  local_currency: string;
}
