import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class VerifyWalletExistResponseDto {
  @ApiProperty({ example: true, required: true, description: 'Wallet exists' })
  @IsBoolean()
  valid: boolean;
}
