import { Module } from '@nestjs/common';
import { AuthModule } from '@src/auth/auth.module';
import { CryptoTxModule } from '@src/crypto-tx/crypto-tx.module';
import { PersonProfileModule } from '@src/user/person-profile/person-profile.module';
import { UserModule } from '@src/user/user.module';
import { VerificationModule } from '@src/verification/verification.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { CountryModule } from '@src/country/country.module';
import { BeneficiaryUserModule } from '@src/beneficiary/beneficiary-user/beneficiary-user.module';
import { BeneficiaryWalletModule } from '@src/beneficiary/beneficiary-wallet/beneficiary-wallet.module';
import { CardModule } from '@src/card/card.module';

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
