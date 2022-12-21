import { Module } from '@nestjs/common';
import { BeneficiaryService } from './beneficiary.service';
import { BeneficiaryController } from './beneficiary.controller';
import { BeneficiaryUserRepository } from './table/beneficiary-user.repository';

@Module({
  providers: [BeneficiaryService, BeneficiaryUserRepository],
  controllers: [BeneficiaryController],
})
export class BeneficiaryModule {}
