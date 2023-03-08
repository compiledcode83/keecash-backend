import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CountryFeeModule } from '@src/country/country-fee/country-fee.module';
import { UserModule } from '@src/user/user.module';
import { CryptoTxRepository } from './crypto-tx-repository';
import { CryptoTxController } from './crypto-tx.controller';
import { CryptoTxService } from './crypto-tx.service';

@Module({
  imports: [HttpModule, UserModule, CountryFeeModule],
  controllers: [CryptoTxController],
  providers: [CryptoTxRepository, CryptoTxService],
  exports: [CryptoTxService],
})
export class CryptoTxModule {}
