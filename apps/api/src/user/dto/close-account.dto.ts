import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CloseAccountDto {
  @ApiProperty({ example: 'Bugs on the app', required: true, description: 'Reasons for leaving' })
  @IsArray()
  closureReasons: string[];

  @ApiProperty({ example: 'Good bye Keecash!', required: false })
  @IsOptional()
  @IsString()
  leavingMessage: string;

  @ApiProperty({
    example: 'Password123!@#',
    description: 'Password to confirm closure',
    required: true,
  })
  @IsString()
  password: string;
}
