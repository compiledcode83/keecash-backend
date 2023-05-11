import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { BeneficiaryUserDto } from '../beneficiary-user/dto/beneficiary-user.dto';
import { AddBeneficiaryWalletDto } from '../beneficiary-wallet/dto/add-beneficiary-wallet.dto';

export class BeneficiaryAllResponseDto {
  @ApiProperty({
    example: [
      {
        name: 'My name',
        url_avatar: 'https://my_avatar.com/file.png',
        beneficiary_user_id: 123,
      },
    ],
    required: true,
    description: 'List of user beneficiary',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BeneficiaryUserDto)
  users: BeneficiaryUserDto[];

  @ApiProperty({
    example: [
      {
        address: 'My name',
        name: 'https://my_avatar.com/file.png',
        type: 'BTC',
      },
    ],
    required: true,
    description: 'List of beneficiary wallet',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddBeneficiaryWalletDto)
  wallets: AddBeneficiaryWalletDto[];
}
