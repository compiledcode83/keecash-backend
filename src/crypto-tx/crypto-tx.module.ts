import { Module } from '@nestjs/common';
import { CryptoTxRepository } from './crypto-tx-repository';
import { CryptoTxController } from './crypto-tx.controller';
import { CryptoTxService } from './crypto-tx.service';

@Module({
  controllers: [CryptoTxController],
  providers: [CryptoTxRepository, CryptoTxService],
})
export class CryptoTxModule {}
