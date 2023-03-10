import { Module } from '@nestjs/common';
import { UserModule } from '@api/user/user.module';
import { BeneficiaryUserRepository } from './beneficiary-user.repository';
import { BeneficiaryUserService } from './beneficiary-user.service';

@Module({
  imports: [UserModule],
  providers: [BeneficiaryUserService, BeneficiaryUserRepository],
  exports: [BeneficiaryUserService],
})
export class BeneficiaryUserModule {}
