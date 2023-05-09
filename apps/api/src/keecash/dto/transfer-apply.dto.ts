import { FiatCurrencyEnum } from 'libs/transaction/src/transaction.types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsString } from 'class-validator';

export class TransferApplyDto {
  @ApiProperty({ example: FiatCurrencyEnum.EUR, description: 'Keecash wallet' })
  @IsEnum(FiatCurrencyEnum)
  keecash_wallet: FiatCurrencyEnum;

  @ApiProperty({ example: 'For my family', description: 'Reason' })
  @IsString()
  reason: string;

  @ApiProperty({ example: 10, description: 'Desired amount' })
  @IsNumber()
  desired_amount: number;

  @ApiProperty({ example: true, description: 'Option that whether you save it as a beneficiary' })
  @IsBoolean()
  to_save_as_beneficiary: boolean;

  @ApiProperty({ example: 2, description: 'ID of beneficiary user' })
  @IsInt()
  beneficiary_user_id: number;
}
