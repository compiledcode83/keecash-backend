import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmEmailVerificationCodeForForgotPincodeResponseDto {
  @ApiProperty({
    example: 'Bearer xxx',
    required: true,
    description: 'Email token after validated email',
  })
  @IsString()
  resetPincodeToken: string;
}
