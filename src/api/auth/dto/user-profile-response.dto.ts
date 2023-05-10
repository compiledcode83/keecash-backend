import { AccountType, UserStatus } from '@api/user/user.types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsInt, IsString, MinLength } from 'class-validator';

export class UserProfileResponseDto {
  @ApiProperty({
    example: 1,
    required: true,
    description: 'User Id',
  })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'Elon', required: true, description: 'User firstname' })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ example: 'Musk', required: true, description: 'User lastname' })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty({ example: 'AXDVEEA1', required: false, description: 'User referral Id' })
  @IsString()
  @MinLength(1)
  referralId: string;

  @ApiProperty({ example: 'elon.musk@tesla.com', required: true, description: 'User email' })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ example: 'COMPLETED', required: true, description: 'User account status' })
  @IsEnum(UserStatus)
  status: string;

  @ApiProperty({ example: 'PERSON', required: true, description: 'User account type' })
  @IsEnum(AccountType)
  @IsString()
  type: AccountType;

  @ApiProperty({
    example: 1,
    required: true,
    description: 'User country Id',
  })
  @IsInt()
  countryId: number;
}
