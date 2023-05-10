import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, Validate, ValidateIf } from 'class-validator';
import { CryptoCurrencyEnum, DateValidator } from '@app/common';
import { TransactionTypeEnum } from '@app/transaction';

export class GetWalletTransactionsQueryDto {
  @ApiProperty({ description: 'From amount', example: '50', required: false })
  @ValidateIf((o) => o.fromAmount || o.toAmount)
  @IsOptional()
  @IsNumberString()
  fromAmount?: number;

  @ApiProperty({ description: 'To amount', example: '1000', required: false })
  @ValidateIf((o) => o.fromAmount || o.toAmount)
  @IsOptional()
  @IsNumberString()
  toAmount?: number;

  @ApiProperty({
    description: 'From date to get data in a specific time',
    example: '1993-02-01',
    required: false,
  })
  @ValidateIf((o) => o.fromDate || o.toDate)
  @IsOptional()
  @Validate(DateValidator)
  fromDate?: string;

  @ApiProperty({
    description: 'To date to get data in a specific time',
    example: '1993-04-01',
    required: false,
  })
  @ValidateIf((o) => o.fromDate || o.toDate)
  @IsOptional()
  @Validate(DateValidator)
  toDate?: string;

  @ApiProperty({ description: 'Array of transaction types', example: 'ALL', required: false })
  @IsOptional()
  txTypes?: TransactionTypeEnum[] | string;

  @ApiProperty({ description: 'Array of cryptoTypes', example: ['BTC', 'USDT'], required: false })
  @IsOptional()
  cryptoTypes?: CryptoCurrencyEnum[];
}
