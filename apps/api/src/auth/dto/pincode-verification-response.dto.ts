import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MinLength } from 'class-validator';

export class PincodeVerificationResponseDto {
  @ApiProperty({
    example: true,
    required: true,
    description: 'Boolean value of whether pincode is valid or not',
  })
  @IsBoolean()
  isConfirm: boolean;

  @ApiProperty({ example: 'Bearer xxx', required: true, description: 'Access token' })
  @IsString()
  @MinLength(1)
  accessToken: string;

  @ApiProperty({ example: '', required: true, description: 'User pincode setting status' })
  @IsString()
  status: string;
}
