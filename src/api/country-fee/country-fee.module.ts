import { Module } from '@nestjs/common';
import { CountryFeeService } from './country-fee.service';
import {
  CardPriceRepository,
  CardTopupFeeRepository,
  TransferReferralCardWithdrawalFeeRepository,
  WalletDepositWithdrawalFeeRepository,
} from './country-fee.repository';

@Module({
  providers: [
    CountryFeeService,
    CardPriceRepository,
    WalletDepositWithdrawalFeeRepository,
    TransferReferralCardWithdrawalFeeRepository,
    CardTopupFeeRepository,
  ],
  exports: [CountryFeeService],
})
export class CountryFeeModule {}
