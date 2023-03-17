import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class VerifyUserExistResponseDto {
  @ApiProperty({ example: true, required: true, description: 'User exists' })
  @IsBoolean()
  valid: boolean;

  @ApiProperty({ example: 'XELA278EZ', required: true, description: 'Beneficiary referral id' })
  @IsOptional()
  @IsString()
  beneficiaryUserId?: string;
}
