import { Module } from '@nestjs/common';
import { BeneficiaryWalletRepository } from './beneficiary-wallet.repository';
import { BeneficiaryWalletService } from './beneficiary-wallet.service';

@Module({
  providers: [BeneficiaryWalletService, BeneficiaryWalletRepository],
  exports: [BeneficiaryWalletService],
})
export class BeneficiaryWalletModule {}
