import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class GetBeneficiaryAdminDto {
  @ApiProperty({
    example: 'user@example.com',
    required: true,
    maximum: 255,
    description: 'Email address',
  })
  @IsEmail()
  email: string;
}
