import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MaxLength, MinLength } from 'class-validator';

export class PincodeLoginDto {
  @ApiProperty({ example: 'user@example.com', required: true, maximum: 255, description: 'E-mail' })
  @MaxLength(255)
  emailOrPhoneNumber: string;

  @ApiProperty({ example: '12345', required: true, description: 'PIN code' })
  @IsString()
  @Length(5, 5)
  password: string;
}
