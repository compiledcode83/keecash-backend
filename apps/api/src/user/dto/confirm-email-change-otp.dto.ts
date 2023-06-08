import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class ConfirmEmailChangeOtpDto {
  @ApiProperty({ example: 'john.doe@example.com', required: true, description: 'New email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', required: true, maximum: 8, description: 'Doe' })
  @IsString()
  @Length(6, 6)
  otp: string;
}
