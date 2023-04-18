import { Module } from '@nestjs/common';
import { BeneficiaryUserRepository } from './beneficiary-user.repository';
import { BeneficiaryUserService } from './beneficiary-user.service';

@Module({
  providers: [BeneficiaryUserService, BeneficiaryUserRepository],
  exports: [BeneficiaryUserService],
})
export class BeneficiaryUserModule {}
