import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { EnvHelper } from '@common/helpers/env.helper';
import appConfig from '@config/app.config';
import databaseConfig from '@config/database.config';
import jwtConfig from '@config/jwt.config';
import { validate } from '@common/validators/env.validator';
import { UserModule } from '@api/user/user.module';
import { AuthModule } from '@api/auth/auth.module';
import { AuthRefreshTokenModule } from '@api/auth-refresh-token/auth-refresh-token.module';
import { VerificationModule } from '@api/verification/verification.module';
import { StorageModule } from '@api/storage/storage.module';
import { CryptoTxModule } from '@api/crypto-tx/crypto-tx.module';
import { BeneficiaryModule } from '@api/beneficiary/beneficiary.module';
import { AdminModule } from '@admin/admin/admin.module';
import { CountryModule } from '@api/country/country.module';
import { DocumentModule } from '@api/user/document/document.module';
import { EnterpriseProfileModule } from '@api/user/enterprise-profile/enterprise-profile.module';
import { PersonProfileModule } from '@api/user/person-profile/person-profile.module';
import { ShareholderModule } from '@api/shareholder/shareholder.module';
import { CountryActivationModule } from '@api/country/country-activation/country-activation.module';
import { CountryFeeModule } from '@api/country/country-fee/country-fee.module';
import verificationConfig from '@config/verification.config';
import storageConfig from '@config/storage.config';
import cryptoConfig from '@config/crypto.config';
import { RouterModule } from '@nestjs/core';
import { BeneficiaryUserModule } from '@api/beneficiary/beneficiary-user/beneficiary-user.module';
import { BeneficiaryWalletModule } from '@api/beneficiary/beneficiary-wallet/beneficiary-wallet.module';
import { CardModule } from '@api/card/card.module';
import { CardHistoryModule } from '@api/card-history/card-history.module';
import { AdminAuthModule } from './admin/admin-auth/admin-auth.module';

EnvHelper.verifyNodeEnv();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: EnvHelper.getEnvFilePath(),
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, verificationConfig, storageConfig, cryptoConfig],
      validate: validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const config = configService.get('databaseConfig');

        return {
          ...config,
          namingStrategy: new SnakeNamingStrategy(),
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    AdminModule,
    AdminAuthModule,
    RouterModule.register([
      {
        path: 'admin/v1',
        module: AdminModule,
        children: [{ path: 'auth', module: AdminAuthModule }],
      },
      {
        path: 'api/v1',
        children: [
          { path: 'auth', module: AuthModule },
          { path: '/', module: AuthRefreshTokenModule },
          { path: '/', module: VerificationModule },
          { path: '/', module: StorageModule },
          { path: '/', module: CryptoTxModule },
          { path: '/', module: CountryActivationModule },
          { path: '/', module: ShareholderModule },
          { path: '/', module: CardModule },
          { path: '/', module: CardHistoryModule },
          {
            path: 'user',
            module: UserModule,
            children: [
              { path: 'person-profile', module: PersonProfileModule },
              { path: 'enterprise-profile', module: EnterpriseProfileModule },
              { path: 'document', module: DocumentModule },
            ],
          },
          {
            path: 'beneficiary',
            module: BeneficiaryModule,
            children: [
              { path: 'user', module: BeneficiaryUserModule },
              { path: 'wallet', module: BeneficiaryWalletModule },
            ],
          },
          {
            path: 'country',
            module: CountryModule,
            children: [
              { path: 'activation', module: CountryActivationModule },
              { path: 'fee', module: CountryFeeModule },
            ],
          },
        ],
      },
    ]),
  ],
})
export class AppModule {}
