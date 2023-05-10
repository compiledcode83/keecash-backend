import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MinLength } from 'class-validator';

export class CreateAccountResponseDto {
  @ApiProperty({
    example: true,
    required: true,
    description: 'if creation is good',
  })
  @IsBoolean()
  isCreated: boolean;

  @ApiProperty({ example: 'Bearer xxx', required: true, description: 'Create Account token' })
  @IsString()
  @MinLength(1)
  token: string;
}
