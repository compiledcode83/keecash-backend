import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class GetBeneficiariesDto {
  @ApiProperty({
    example: 'user@example.com',
    required: true,
    maximum: 255,
    description: 'User email address',
  })
  @IsEmail()
  email: string;
}
