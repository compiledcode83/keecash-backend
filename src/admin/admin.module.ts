import { Module } from '@nestjs/common';
import { AuthModule } from '@src/auth/auth.module';
import { BeneficiaryModule } from '@src/beneficiary/beneficiary.module';
import { CryptoTxModule } from '@src/crypto-tx/crypto-tx.module';
import { PersonProfileModule } from '@src/user/person-profile/person-profile.module';
import { UserModule } from '@src/user/user.module';
import { VerificationModule } from '@src/verification/verification.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { CountryModule } from '@src/country/country.module';

@Module({
  imports: [
    UserModule,
    VerificationModule,
    // AuthModule,
    UserModule,
    CryptoTxModule,
    BeneficiaryModule,
    PersonProfileModule,
    CountryModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
  exports: [AdminService],
})
export class AdminModule {}
