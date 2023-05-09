import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateShareholderDto {
  @ApiProperty({
    example: 'Jhon',
    required: true,
    maximum: 255,
    description: 'First name',
  })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    required: true,
    maximum: 255,
    description: 'Doe',
  })
  @IsString()
  @MinLength(1)
  lastName: string;
}
