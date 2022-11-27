import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class SendPhoneNumberVerificationCodeDto {
  @ApiProperty({
    example: 'Phone Number',
    required: true,
    maximum: 255,
    description: '+XXXXXXXXXXX',
  })
  @IsPhoneNumber()
  phoneNumber: string;
}
