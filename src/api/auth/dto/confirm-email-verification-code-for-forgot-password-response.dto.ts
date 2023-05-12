import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ConfirmEmailverificationCodeForForgetPasswordResponseDto {
  @ApiProperty({
    example: 'Bearer xxx',
    required: true,
    description: 'Reset password token',
  })
  @IsString()
  @IsOptional()
  resetPasswordToken: string;

  @ApiProperty({
    example: true,
    required: true,
    description: 'Email code is confirmed',
  })
  @IsBoolean()
  isConfirmed: boolean;
}
