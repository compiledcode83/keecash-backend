import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmPhoneNumberVerificationCodeDto {
  @ApiProperty({
    example: '154111',
    required: true,
    maximum: 255,
    description: 'Verification Code',
  })
  @IsString()
  code: string;
}