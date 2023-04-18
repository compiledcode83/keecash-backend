import { Module } from '@nestjs/common';
import { TripleAModule } from '@api/triple-a/triple-a.module';
import { AdminCryptoTxController } from './crypto-tx.controller';

@Module({
  imports: [TripleAModule],
  controllers: [AdminCryptoTxController],
})
export class AdminCryptoTxModule {}
