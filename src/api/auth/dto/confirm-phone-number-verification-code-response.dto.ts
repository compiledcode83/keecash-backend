import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ConfirmPhoneNumberVerificationCodeResponseDto {
  @ApiProperty({
    example: true,
    required: true,
    description: 'True if email is well confirmed',
  })
  @IsBoolean()
  isConfirmed: boolean;
}
