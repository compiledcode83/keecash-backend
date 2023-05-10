import { UserStatus } from '@api/user/user.types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsString, MinLength } from 'class-validator';

export class UserLoginResponseDto {
  @ApiProperty({ example: 'Bearer xxx', required: true, description: 'User login token' })
  @IsString()
  @MinLength(1)
  token: string;

  @ApiProperty({ example: 'COMPLETED', required: true, description: 'User account status' })
  @IsEnum(UserStatus)
  status: string;

  @ApiProperty({ example: true, required: true, description: 'if pincode already set' })
  @IsBoolean()
  pincodeSet: boolean;
}
