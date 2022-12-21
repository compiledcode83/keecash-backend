import { ApiProperty } from '@nestjs/swagger';
import { CRYTPO_CURRENCY_NAME } from '@src/crypto-tx/crypto-tx.entity';
import { IsEnum, IsString, MaxLength } from 'class-validator';

export class AddBeneficiaryWalletDto {
  @ApiProperty({
    example: 'TDUouyRW3whZrDm1RjNY1WfikC2Y73rPGw',
    required: true,
    maximum: 255,
    description: 'Wallet address',
  })
  @IsString()
  @MaxLength(255)
  address: string;

  @ApiProperty({
    example: 'Bitcoin wallet',
    required: true,
    maximum: 255,
    description: 'Wallet name',
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'USDT',
    required: true,
    maximum: 255,
    description: 'Cryto currency Name',
  })
  @IsEnum(CRYTPO_CURRENCY_NAME)
  type: CRYTPO_CURRENCY_NAME;
}
