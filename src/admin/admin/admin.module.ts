import { Module } from '@nestjs/common';
import { AuthModule } from '@src/api/auth/auth.module';
import { CryptoTxModule } from '@api/crypto-tx/crypto-tx.module';
import { PersonProfileModule } from '@api/user/person-profile/person-profile.module';
import { UserModule } from '@api/user/user.module';
import { VerificationModule } from '@api/verification/verification.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { CountryModule } from '@api/country/country.module';
import { BeneficiaryUserModule } from '@api/beneficiary/beneficiary-user/beneficiary-user.module';
import { BeneficiaryWalletModule } from '@api/beneficiary/beneficiary-wallet/beneficiary-wallet.module';
import { CardModule } from '@api/card/card.module';

@Module({
  imports: [
    UserModule,
    VerificationModule,
    // AuthModule,
    UserModule,
    CryptoTxModule,
    BeneficiaryUserModule,
    BeneficiaryWalletModule,
    PersonProfileModule,
    CountryModule,
    CardModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
  exports: [AdminService],
})
export class AdminModule {}
