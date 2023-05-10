import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SendPhoneNumberVerificationCodeResponseDto {
  @ApiProperty({
    example: true,
    required: true,
    description: 'True if phone code is sent',
  })
  @IsBoolean()
  isSent: boolean;
}
