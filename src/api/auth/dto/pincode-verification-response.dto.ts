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

  @ApiProperty({ example: true, required: true, description: 'True if user country is activated' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: false, required: true, description: 'Is app in maintenance' })
  @IsBoolean()
  isAppInMaintenance: boolean;

  @ApiProperty({ example: '', required: true, description: 'Inactive app message' })
  @IsString()
  inactiveMessage: string;

  @ApiProperty({ example: '', required: true, description: 'Maintenance app message' })
  @IsString()
  maintenanceMessage: string;
}
