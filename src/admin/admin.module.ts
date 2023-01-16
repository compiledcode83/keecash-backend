import { Module } from '@nestjs/common';
import { AuthModule } from '@src/auth/auth.module';
import { BeneficiaryModule } from '@src/beneficiary/beneficiary.module';
import { CryptoTxModule } from '@src/crypto-tx/crypto-tx.module';
import { UserModule } from '@src/user/user.module';
import { VerificationModule } from '@src/verification/verification.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    UserModule,
    VerificationModule,
    AuthModule,
    UserModule,
    CryptoTxModule,
    BeneficiaryModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
