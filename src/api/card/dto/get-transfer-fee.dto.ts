import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString } from 'class-validator';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';

export class GetTransferFeeDto {
  @ApiProperty({ example: FiatCurrencyEnum.EUR, description: 'Keecash wallet address' })
  @IsEnum(FiatCurrencyEnum)
  keecash_wallet: FiatCurrencyEnum;

  @ApiProperty({ example: 100, description: 'Transfer number' })
  @IsNumberString()
  desired_amount: string;
}
