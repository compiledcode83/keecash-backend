import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumberString } from 'class-validator';
import { FiatCurrencyEnum } from '@app/common';
import { CardUsageEnum } from '@app/card';
import { UserAccessTokenInterface } from '@api/auth/auth.type';

export class GetCreateCardTotalFeeDto {
  @ApiProperty({ example: FiatCurrencyEnum.EUR, description: 'Keecash wallet currency' })
  @IsEnum(FiatCurrencyEnum)
  currency: FiatCurrencyEnum;

  @ApiProperty({ example: CardUsageEnum.Multiple, description: 'Type of card usage to be created' })
  @IsEnum(CardUsageEnum)
  cardUsageType: CardUsageEnum;

  @ApiProperty({ example: 123, description: 'Amount of money to be topped up' })
  @IsNumberString()
  desiredAmount: string;

  @IsNotEmpty()
  user: UserAccessTokenInterface;
}
