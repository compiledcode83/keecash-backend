import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { DocumentType } from '../person-profile.entity';

export class CreatePersonProfileDto {
  @ApiProperty({ description: 'Address1', maximum: 64, required: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  address1: string;

  @ApiProperty({ description: 'address2', maximum: 64, required: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  address2: string;

  @ApiProperty({ description: 'zipcode', maximum: 64, required: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  zipcode: string;

  @ApiProperty({ description: 'city', maximum: 64, required: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  city: string;

  @ApiProperty({ description: 'country', maximum: 64, required: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  country: string;

  @ApiProperty({ description: 'documentType', maximum: 64, required: true })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({ description: 'imageLink', maximum: 64, required: true })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  imageLink: string;
}
