import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SendPhoneVerificationResponseDto {
  @ApiProperty({ example: true, description: 'Is verification code sent' })
  @IsBoolean()
  isSent: boolean;

  @ApiProperty({ example: 'ey6voxkoisjf928', description: 'Access token' })
  @IsOptional()
  @IsString()
  accessToken?: string;
}
