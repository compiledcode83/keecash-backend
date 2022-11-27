import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class ConfirmEmailVerificationCodeDto {
  @ApiProperty({
    example: 'user@example.com',
    required: true,
    maximum: 255,
    description: 'Email address',
  })
  @IsPhoneNumber()
  email: string;

  @ApiProperty({
    example: '15411',
    required: true,
    maximum: 255,
    description: 'Verification Code',
  })
  @IsString()
  code: string;
}
