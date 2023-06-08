import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '@app/user';
import { UserAccessTokenInterface } from '@api/auth/auth.type';

export class GetCardHistoryFilterDto {
  @ApiProperty({ example: 'card_name', required: false })
  @IsOptional()
  must_contains: string;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  amount_min: string;

  @ApiProperty({ example: 100, required: false })
  @IsOptional()
  amount_max: string;

  @ApiProperty({ example: '2022-01-01', required: false })
  @IsOptional()
  from_date: string;

  @ApiProperty({ example: '2022-02-01', required: false })
  @IsOptional()
  to_date: string;

  @ApiProperty({ example: ['all', 'debit', 'credit'], required: false })
  @IsOptional()
  type_list_filter: string[];

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  type_list: string[];

  @ApiProperty({ example: 1000, required: false })
  @IsOptional()
  range_amount_max: string;

  @IsNotEmpty()
  user: UserAccessTokenInterface;

  @IsString()
  cardId: string;
}
