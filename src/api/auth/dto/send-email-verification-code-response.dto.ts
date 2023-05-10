import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SendEmailVerificationCodeResponseDto {
  @ApiProperty({
    example: true,
    required: true,
    description: 'True if email is sent',
  })
  @IsBoolean()
  isSent: boolean;
}
