import { v4 as uuid } from 'uuid';
import { CardBrandEnum, CardTypeEnum } from '@app/card';
import { FiatCurrencyEnum } from '@app/common';

export class BridgecardCreateMessage {
  operationUuid: string;
  userId: number;
  cardholderId: string;
  cardId: number;
  cardUuid: string;
  type: CardTypeEnum;
  brand: CardBrandEnum;
  currency: FiatCurrencyEnum;
  cardName: string;
  cardPrice: number;
  topupAmount: number;
  totalToPay: number;
  appliedFee: number;
  fixedFee: number;
  percentFee: number;

  constructor(data: Partial<BridgecardCreateMessage>) {
    Object.assign(this, data);
    this.operationUuid = uuid();
  }

  toString() {
    return JSON.stringify(this);
  }
}
