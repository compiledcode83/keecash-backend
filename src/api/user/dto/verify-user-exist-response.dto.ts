import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class VerifyUserExistResponseDto {
  @ApiProperty({ example: true, required: true, description: 'User exists' })
  @IsBoolean()
  valid: boolean;

  @ApiProperty({ example: 2, required: true, description: `Beneficiary user's id` })
  @IsString()
  beneficiaryUserId: number;

  @ApiProperty({ example: 'my name', required: true, description: `Beneficiary user's name` })
  @IsString()
  beneficiaryName: string;
}
