import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class PincodeVerificationDto {
  @ApiProperty({ example: '1234567', required: true, description: 'PIN code' })
  @IsString()
  @Length(7, 7)
  pincode: string;
}
