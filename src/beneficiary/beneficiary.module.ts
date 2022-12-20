import { Module } from '@nestjs/common';
import { BeneficiaryService } from './beneficiary.service';
import { BeneficiaryController } from './beneficiary.controller';

@Module({
  providers: [BeneficiaryService],
  controllers: [BeneficiaryController]
})
export class BeneficiaryModule {}
