import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PasswordResetResponseDto {
  @ApiProperty({
    example: true,
    required: true,
    description: 'Boolean value of whether pincode is reset or not',
  })
  @IsBoolean()
  isReset: boolean;
}
