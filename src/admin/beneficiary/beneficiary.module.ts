import { Module } from '@nestjs/common';
import { BeneficiaryModule } from '@api/beneficiary/beneficiary.module';
import { AdminBeneficiaryController } from './beneficiary.controller';

@Module({
  imports: [BeneficiaryModule],
  controllers: [AdminBeneficiaryController],
})
export class AdminBeneficiaryModule {}
