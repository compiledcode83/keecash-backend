import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class PincodeVerificationDto {
  @ApiProperty({ example: '12345', required: true, description: 'PIN code' })
  @IsString()
  @Length(5, 5)
  pincode: string;
}
