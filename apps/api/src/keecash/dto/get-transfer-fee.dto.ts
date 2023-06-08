import { ApiProperty } from '@nestjs/swagger';
<<<<<<< HEAD:apps/api/src/keecash/dto/get-transfer-fee.dto.ts
import { IsEnum, IsNumberString } from 'class-validator';
import { FiatCurrencyEnum } from '@app/common';
=======
import { IsEnum, IsNumber } from 'class-validator';
import { FiatCurrencyEnum } from '@api/transaction/transaction.types';
>>>>>>> 381621e06e83efe140d01ba95f21884ffdfb849c:src/api/card/dto/get-transfer-fee.dto.ts

export class GetTransferFeeDto {
  @ApiProperty({ example: FiatCurrencyEnum.EUR, description: 'Keecash wallet address' })
  @IsEnum(FiatCurrencyEnum)
  keecash_wallet: FiatCurrencyEnum;

  @ApiProperty({ example: 100, description: 'Transfer number' })
  @IsNumber()
  desired_amount: number;
}
