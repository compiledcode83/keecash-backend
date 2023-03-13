import { ApiProperty } from '@nestjs/swagger';
import { CardSearchIndexEnum } from '@admin/card/card.types';
import { DateValidator } from '@common/validators/date-validator';
import { IsEnum, IsInt, IsOptional, IsString, Validate, ValidateIf } from 'class-validator';

export class GetCardAdminDto {
  @ApiProperty({
    example: 1,
    required: true,
    description: 'User Id',
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'From date to get data in a specific time',
    example: '1993-02-01',
    required: true,
  })
  @ValidateIf((o) => o.fromDate || o.toDate)
  @IsOptional()
  @Validate(DateValidator)
  fromDate: string;

  @ApiProperty({
    description: 'To date to get data in a specific time',
    example: '1993-01-01',
    required: true,
  })
  @ValidateIf((o) => o.fromDate || o.toDate)
  @IsOptional()
  @Validate(DateValidator)
  toDate: string;

  @ApiProperty({ description: 'Index of card data to find by' })
  @IsEnum(CardSearchIndexEnum)
  searchIndex: CardSearchIndexEnum;

  @ApiProperty({ description: 'Index of card data to find by' })
  @IsOptional()
  @IsString()
  searchValue: string;
}