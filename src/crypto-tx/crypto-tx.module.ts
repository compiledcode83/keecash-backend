import { Module } from '@nestjs/common';
import { CryptoTxController } from './crypto-tx.controller';

@Module({
  controllers: [CryptoTxController]
})
export class CryptoTxModule {}
