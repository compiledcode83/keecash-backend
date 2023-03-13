import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SetPincodeDto {
  @ApiProperty({ example: '12345', required: true, description: 'PIN code' })
  @IsString()
  pincode: string;
}
