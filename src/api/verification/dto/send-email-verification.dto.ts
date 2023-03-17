import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendEmailVerificationCodeDto {
  @ApiProperty({
    example: 'user@exmple.com',
    required: true,
    maximum: 255,
    description: 'Email address',
  })
  @IsEmail()
  email: string;
}
