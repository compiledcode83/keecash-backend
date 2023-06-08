import { Module } from '@nestjs/common';
import { BeneficiaryWalletModule } from '@app/beneficiary-wallet';
import { BeneficiaryUserModule } from '@app/beneficiary-user';
import { BeneficiaryService } from './beneficiary.service';
import { BeneficiaryController } from './beneficiary.controller';

@Module({
  imports: [BeneficiaryWalletModule, BeneficiaryUserModule],
  providers: [BeneficiaryService],
  controllers: [BeneficiaryController],
  exports: [BeneficiaryService],
})
export class BeneficiaryModule {}
