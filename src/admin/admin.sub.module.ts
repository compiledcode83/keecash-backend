import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AdminModule } from '@admin/admin/admin.module';
import { AdminAuthModule } from '@admin/auth/admin-auth.module';
import { AdminBeneficiaryModule } from '@admin/beneficiary/beneficiary.module';
import { AdminCryptoTxModule } from '@admin/crypto-tx/crypto-tx.module';
import { AdminCardModule } from '@admin/card/card.module';
import { AdminUserModule } from '@admin/user/user.module';
import { AdminCountryModule } from '@admin/country/country.module';

@Module({
  imports: [
    AdminModule,
    AdminAuthModule,
    AdminBeneficiaryModule,
    AdminCardModule,
    AdminCryptoTxModule,
    AdminCountryModule,
    AdminUserModule,
    RouterModule.register([
      {
        path: '/admin',
        children: [
          { path: '/', module: AdminModule },
          { path: '/auth', module: AdminAuthModule },
          { path: '/card', module: AdminCardModule },
          { path: '/country', module: AdminCountryModule },
          { path: '/crypto-tx', module: AdminCryptoTxModule },
          { path: '/user', module: AdminUserModule },
          { path: '/beneficiary', module: AdminBeneficiaryModule },
        ],
      },
    ]),
  ],
})
export class AdminSubModule {}
