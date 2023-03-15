import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PincodeSetResponseDto {
  @ApiProperty({
    example: true,
    required: true,
    description: 'Boolean value of whether pincode is set or not',
  })
  @IsBoolean()
  isSet: boolean;
}
