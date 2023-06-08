import { IsEnum, IsNumber, IsString } from 'class-validator';
import { FiatCurrencyEnum } from '@app/common';

export class FundBridgecardDto {
  @IsString()
  card_id: string;

  @IsNumber()
  amount: number;

  @IsString()
  transaction_reference: string;

  @IsEnum(FiatCurrencyEnum)
  currency: FiatCurrencyEnum;
}
