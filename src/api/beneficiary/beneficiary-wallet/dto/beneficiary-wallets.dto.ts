import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { BeneficiaryWallet } from '../beneficiary-wallet.entity';
import { Type } from 'class-transformer';

export class BeneficiaryWalletsDto {
  @ApiProperty({
    example: [
      {
        id: 0,
        userId: 0,
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        name: 'Satoshi address',
        type: 'BTC',
        createdAt: '2023-05-10T11:19:22.012Z',
        updatedAt: '2023-05-10T11:19:22.012Z',
        deletedAt: null,
      },
    ],
    required: true,
    description: 'List of user beneficiary',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BeneficiaryWallet)
  beneficiary_wallets: string;
}
