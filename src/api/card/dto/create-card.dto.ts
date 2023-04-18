import { IsEnum, IsNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';
import { CardTypeEnum, CardUsageEnum } from '../card.types';

export class CreateCardDto {
  @ApiProperty({ example: FiatCurrencyEnum.EUR, description: 'Keecash wallet currency' })
  @IsEnum(FiatCurrencyEnum)
  keecashWallet: FiatCurrencyEnum;

  @ApiProperty({
    example: CardTypeEnum.Virtual,
    description: 'Card type (currently only VIRTUAL card is available)',
  })
  @IsEnum(CardTypeEnum)
  cardType: CardTypeEnum;

  @ApiProperty({ example: CardUsageEnum.Multiple, description: 'Card usage type' })
  @IsEnum(CardUsageEnum)
  cardUsage: CardUsageEnum;

  @ApiProperty({ example: 'Camelleon', description: 'Card name' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 79.25, description: 'Total pay amount (consider removing)' })
  @IsNumber()
  totalToPay: number;

  @ApiProperty({ example: 60, description: 'Card topup amount' })
  @IsNumber()
  topupAmount: number;
}
