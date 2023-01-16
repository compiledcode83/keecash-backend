import { ApiProperty } from '@nestjs/swagger';
import { CryptoTransactionFilterDto } from '@src/crypto-tx/dto/crypto-transaction-filter.dto';
import { IsEmail } from 'class-validator';

export class GetCryptoTxAdminDto extends CryptoTransactionFilterDto {
  @ApiProperty({
    example: 'user@example.com',
    required: true,
    maximum: 255,
    description: 'Email address',
  })
  @IsEmail()
  email: string;
}
