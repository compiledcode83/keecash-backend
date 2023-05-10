import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MinLength } from 'class-validator';

export class SumsubTokenResponseDto {
  @ApiProperty({ example: 'Bearer xxx', required: true, description: 'Sumsub access token' })
  @IsString()
  @MinLength(1)
  token: string;
}
