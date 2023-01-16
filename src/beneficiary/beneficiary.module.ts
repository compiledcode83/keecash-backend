import { Module } from '@nestjs/common';
import { BeneficiaryService } from './beneficiary.service';
import { BeneficiaryController } from './beneficiary.controller';
import { BeneficiaryUserRepository } from './table/beneficiary-user.repository';
import { UserModule } from '@src/user/user.module';
import { BeneficiaryWalletRepository } from './table/beneficiary-wallet.repository';

@Module({
  imports: [UserModule],
  providers: [
    BeneficiaryService,
    BeneficiaryUserRepository,
    BeneficiaryWalletRepository,
  ],
  controllers: [BeneficiaryController],
  exports: [BeneficiaryService],
})
export class BeneficiaryModule {}
