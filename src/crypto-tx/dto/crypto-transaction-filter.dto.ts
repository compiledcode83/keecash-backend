import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, Validate, ValidateIf } from 'class-validator';
import { DateValidator } from '../../common/validators/date-validator';
import { CryptoTx } from '../crypto-tx.entity';
import { FiatCurrencyEnum, TxTypeEnum } from '../crypto-tx.types';
import { CursorFilterDto } from '../../common/pagination/cursor-filter.dto';

export class CryptoTransactionFilterDto extends CursorFilterDto {
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

  @ApiProperty({
    description: 'Currency id to get data filtered by currency',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsEnum(FiatCurrencyEnum)
  currencyName: FiatCurrencyEnum;

  @ApiProperty({
    description: 'Currency id to get data filtered by currency',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsEnum(TxTypeEnum)
  type: TxTypeEnum;

  @ApiProperty({
    description: 'User id to get data filtered by user',
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  userId: number;

  @ApiProperty({ example: 'createdAt', enum: ['createdAt'], required: false })
  @IsOptional()
  @IsIn(['createdAt', 'id'])
  orderParam: keyof CryptoTx = 'createdAt';
}
