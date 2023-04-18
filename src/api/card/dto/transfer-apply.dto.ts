import { FiatCurrencyEnum } from '@api/transaction/transaction.types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsString } from 'class-validator';

export class TransferApplyDto {
  @ApiProperty({ example: FiatCurrencyEnum.EUR, description: 'Keecash wallet' })
  @IsEnum(FiatCurrencyEnum)
  keecash_wallet: FiatCurrencyEnum;

  @ApiProperty({ example: 'For my family', description: 'Reason' })
  @IsString()
  reason: string;

  @ApiProperty({ example: 100, description: 'Desired amount' })
  @IsNumber()
  @IsString()
  desired_amount: number;

  @ApiProperty({ example: 200, description: 'Total to pay' })
  @IsNumber()
  total_to_pay: number;

  @ApiProperty({ example: 1.26, description: 'Applied fee' })
  @IsNumber()
  applied_fee: number;

  @ApiProperty({ example: 0.99, description: 'Fixed fee' })
  @IsNumber()
  fixed_fee: number;

  @ApiProperty({ example: 1.5, description: 'Percentage fee' })
  @IsNumber()
  percentage_fee: number;

  @ApiProperty({ example: true, description: 'Option that whether you save it as a beneficiary' })
  @IsBoolean()
  to_save_as_beneficiary: boolean;

  @ApiProperty({ example: true, description: 'Address' })
  @IsString()
  address: string;

  @ApiProperty({ example: 2, description: 'ID of beneficiary user' })
  @IsInt()
  beneficiary_user_id: number;
}
