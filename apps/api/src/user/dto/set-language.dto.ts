import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Language } from '@app/user';

export class SetLanguageDto {
  @ApiProperty({ example: 'ENGLISH', description: 'Language', maximum: 255, required: true })
  @IsEnum(Language)
  language: Language;
}
