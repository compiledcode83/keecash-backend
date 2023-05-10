import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmEmailverificationCodeForForgetPasswordResponseDto {
  @ApiProperty({
    example: 'Bearer xxx',
    required: true,
    description: 'Reset password token',
  })
  @IsString()
  resetPasswordToken: string;
}
