import { Module, forwardRef } from '@nestjs/common';
import { BeneficiaryUserRepository } from './beneficiary-user.repository';
import { BeneficiaryUserService } from './beneficiary-user.service';
import { AuthModule } from '@api/auth/auth.module';
import { UserModule } from '@api/user/user.module';

@Module({
  imports: [AuthModule, forwardRef(() => UserModule)],
  providers: [BeneficiaryUserService, BeneficiaryUserRepository],
  exports: [BeneficiaryUserService],
})
export class BeneficiaryUserModule {}
