import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, MinLength } from 'class-validator';

export class UpdateCountryDto {
  @ApiProperty({
    example: 1,
    required: true,
    description: 'Country ID',
  })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Country name', maximum: 128, required: false })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ description: 'Country code', maximum: 128, required: false })
  @IsString()
  @MinLength(1)
  countryCode: string;

  @ApiProperty({ description: 'Phone code', maximum: 128, required: false })
  @IsString()
  @MinLength(1)
  phoneCode: string;

  @ApiProperty({
    description: 'If the country is active now.',
    maximum: 128,
    required: false,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Message if the country is inactive',
    maximum: 128,
    required: false,
  })
  @IsString()
  inactiveMessage: string;

  @ApiProperty({
    description: 'If the country is in maintenance.',
    maximum: 128,
    required: false,
  })
  @IsBoolean()
  inMaintenance: boolean;

  @ApiProperty({
    description: 'Message if the country is in maintenance',
    maximum: 128,
    required: false,
  })
  @IsString()
  inMaintenanceMessage: string;

  @ApiProperty({
    description: 'If deposit is active in this country.',
    maximum: 128,
    required: false,
  })
  @IsBoolean()
  depositActivated: boolean;

  @ApiProperty({
    description: 'Message if deposit is not available in this country',
    maximum: 128,
    required: false,
  })
  @IsString()
  depositMessage: string;

  @ApiProperty({
    description: 'If withdraw is active in this country.',
    maximum: 128,
    required: false,
  })
  @IsBoolean()
  withdrawActivated: boolean;

  @ApiProperty({
    description: 'Message if withdraw is not available in this country',
    maximum: 128,
    required: false,
  })
  @IsString()
  withdrawMessage: string;

  @ApiProperty({
    description: 'If transfer is active in this country.',
    maximum: 128,
    required: false,
  })
  @IsBoolean()
  transferActivated: boolean;

  @ApiProperty({
    description: 'Message if transfer is not available in this country',
    maximum: 128,
    required: false,
  })
  @IsString()
  transferMessage: string;

  @ApiProperty({
    description: 'If card is active in this country.',
    maximum: 128,
    required: false,
  })
  @IsBoolean()
  cardActivated: boolean;

  @ApiProperty({
    description: 'Message if card is not available in this country',
    maximum: 128,
    required: false,
  })
  @IsString()
  cardMessage: string;

  @ApiProperty({
    description: 'If card multiple is active in this country.',
    maximum: 128,
    required: false,
  })
  @IsBoolean()
  cardMultipleActivated: boolean;

  @ApiProperty({
    description: 'Message if card multiple is not available in this country',
    maximum: 128,
    required: false,
  })
  @IsString()
  cardMultipleMessage: string;

  @ApiProperty({
    description: 'If card unique is active in this country.',
    maximum: 128,
    required: false,
  })
  @IsBoolean()
  cardUniqueActivated: boolean;

  @ApiProperty({
    description: 'Message if card unique is not available in this country',
    maximum: 128,
    required: false,
  })
  @IsString()
  cardUniqueMessage: string;

  @ApiProperty({
    description: 'If card physic is active in this country.',
    maximum: 128,
    required: false,
  })
  @IsBoolean()
  cardPhysicActivated: boolean;

  @ApiProperty({
    description: 'Message if card physic is not available in this country',
    maximum: 128,
    required: false,
  })
  @IsString()
  cardPhysicMessage: string;
}
