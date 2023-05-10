import { IsEnum, IsNumber, IsString } from 'class-validator';
import { FiatCurrencyEnum } from '@app/common';
import { CardBrandEnum, CardTypeEnum } from '@app/card';

export class CreateBridgecardDto {
  @IsNumber()
  userId: number;

  @IsString()
  cardholderId: string;

  @IsEnum(CardTypeEnum)
  type: CardTypeEnum;

  @IsEnum(CardTypeEnum)
  brand: CardBrandEnum;

  @IsEnum(FiatCurrencyEnum)
  currency: FiatCurrencyEnum;

  @IsString()
  cardName: string;
}
