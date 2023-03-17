import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class ConfirmEmailVerificationCodeResponseDto {
  @ApiProperty({ example: true, description: 'Is verification code confirmed' })
  @IsBoolean()
  isConfirmed: boolean;

  @ApiProperty({ example: 'ey6voxkoey...', description: 'Access token' })
  @IsString()
  accessToken: string;
}
