import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { FiatCurrencyEnum } from '@app/common';
import { UserAccessTokenInterface } from '@api/auth/auth.type';

export class GetCreateCardSettingsDto {
  @ApiProperty({
    example: FiatCurrencyEnum.EUR,
    description: 'Keecash wallet currency',
    required: true,
  })
  @IsEnum(FiatCurrencyEnum)
  currency: FiatCurrencyEnum;

  @IsNotEmpty()
  user: UserAccessTokenInterface;
}
