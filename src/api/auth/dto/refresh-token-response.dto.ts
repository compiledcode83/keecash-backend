import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenResponseDto {
  @ApiProperty({ example: 'Bearer xxx', required: true, description: 'Refresh token' })
  @IsString()
  refreshToken: boolean;
}
