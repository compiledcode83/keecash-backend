import { Module } from '@nestjs/common';
import { BeneficiaryService } from './beneficiary.service';
import { BeneficiaryController } from './beneficiary.controller';
import { BeneficiaryWalletModule } from './beneficiary-wallet/beneficiary-wallet.module';
import { BeneficiaryUserModule } from './beneficiary-user/beneficiary-user.module';

@Module({
  imports: [BeneficiaryWalletModule, BeneficiaryUserModule],
  providers: [BeneficiaryService],
  controllers: [BeneficiaryController],
  exports: [BeneficiaryService],
})
export class BeneficiaryModule {}
