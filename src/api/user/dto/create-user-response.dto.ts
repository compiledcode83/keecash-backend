import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

export class CreateUserResponseDto {
  @ApiProperty({ example: true, description: `Is new user is created` })
  @IsBoolean()
  isCreated: boolean;

  @ApiProperty({ example: 'eydsivokovbis', description: 'Access token' })
  @IsString()
  accessToken: string;
}
