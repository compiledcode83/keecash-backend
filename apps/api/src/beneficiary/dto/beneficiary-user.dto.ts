import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class BeneficiaryUserDto {
  @ApiProperty({ example: 'My name', required: true, description: 'Beneficiary user name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'https://my_avatar.com/file.png',
    required: true,
    description: 'Beneficiary user avatar link',
  })
  @IsString()
  url_avatar: string;

  @ApiProperty({ example: 123, required: true, description: 'Beneficiary user Id' })
  @IsNumber()
  @MaxLength(255)
  beneficiary_user_id: string;
}
