import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ConfirmEmailVerificationCodeResponseDto {
  @ApiProperty({
    example: true,
    required: true,
    description: 'True if email is well confirmed',
  })
  @IsBoolean()
  isConfirmed: boolean;
}
