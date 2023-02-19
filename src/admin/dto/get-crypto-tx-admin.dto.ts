import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { CryptoTransactionFilterDto } from '@src/crypto-tx/dto/crypto-transaction-filter.dto';

export class GetCryptoTxAdminDto extends CryptoTransactionFilterDto {
  @ApiProperty({
    example: 'user@example.com',
    required: true,
    maximum: 255,
    description: 'Email address',
  })
  @IsInt()
  userId: number;
}
