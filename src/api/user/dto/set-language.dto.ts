import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Language } from '../user.types';

export class SetLanguageDto {
  @ApiProperty({ example: 'ENGLISH', description: 'Language', maximum: 255, required: true })
  @IsEnum(Language)
  language: Language;
}
