import { Module } from '@nestjs/common';
import { CryptoTxModule } from '@src/api/crypto-tx/crypto-tx.module';
import { AdminCryptoTxController } from './crypto-tx.controller';

@Module({
  imports: [CryptoTxModule],
  controllers: [AdminCryptoTxController],
})
export class AdminCryptoTxModule {}
