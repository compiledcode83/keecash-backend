import { ApiProperty } from '@nestjs/swagger';
<<<<<<< HEAD:apps/api/src/keecash/dto/get-create-card-total-fee.dto.ts
import { IsEnum, IsNotEmpty, IsNumberString } from 'class-validator';
import { FiatCurrencyEnum } from '@app/common';
import { CardUsageEnum } from '@app/card';
import { UserAccessTokenInterface } from '@api/auth/auth.type';
=======
import { IsEnum, IsNumber } from 'class-validator';
import { CardUsageEnum } from '../card.types';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';
>>>>>>> 381621e06e83efe140d01ba95f21884ffdfb849c:src/api/card/dto/get-create-card-total-fee.dto.ts

export class GetCreateCardTotalFeeDto {
  @ApiProperty({ example: FiatCurrencyEnum.EUR, description: 'Keecash wallet currency' })
  @IsEnum(FiatCurrencyEnum)
  currency: FiatCurrencyEnum;

  @ApiProperty({ example: CardUsageEnum.Multiple, description: 'Type of card usage to be created' })
  @IsEnum(CardUsageEnum)
  cardUsageType: CardUsageEnum;

  @ApiProperty({ example: 123, description: 'Amount of money to be topped up' })
<<<<<<< HEAD:apps/api/src/keecash/dto/get-create-card-total-fee.dto.ts
  @IsNumberString()
  desiredAmount: string;

  @IsNotEmpty()
  user: UserAccessTokenInterface;
=======
  @IsNumber()
  desiredAmount: number;
>>>>>>> 381621e06e83efe140d01ba95f21884ffdfb849c:src/api/card/dto/get-create-card-total-fee.dto.ts
}
