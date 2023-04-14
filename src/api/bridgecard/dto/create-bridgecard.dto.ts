import { IsEnum, IsNumber, IsString } from 'class-validator';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';
import { CardBrandEnum, CardTypeEnum } from '@api/card/card.types';

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
