import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { EnvHelper } from './common/helpers/env.helper';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { validate } from './common/validators/env.validator';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthRefreshTokenModule } from './auth-refresh-token/auth-refresh-token.module';
import { VerificationModule } from './verification/verification.module';
import { StorageModule } from './storage/storage.module';
import { CryptoTxModule } from './crypto-tx/crypto-tx.module';
import { BeneficiaryModule } from './beneficiary/beneficiary.module';
import { AdminModule } from './admin/admin.module';
import { CountryModule } from './country/country.module';
import { DocumentModule } from './user/document/document.module';
import { EnterpriseProfileModule } from './user/enterprise-profile/enterprise-profile.module';
import { PersonProfileModule } from './user/person-profile/person-profile.module';
import { ShareholderModule } from './shareholder/shareholder.module';
import { CountryActivationModule } from './country/country-activation/country-activation.module';
import { CountryFeeModule } from './country/country-fee/country-fee.module';
import verificationConfig from './config/verification.config';
import storageConfig from './config/storage.config';
import cryptoConfig from './config/crypto.config';
import { RouterModule } from '@nestjs/core';
import { BeneficiaryUserModule } from './beneficiary/beneficiary-user/beneficiary-user.module';
import { BeneficiaryWalletModule } from './beneficiary/beneficiary-wallet/beneficiary-wallet.module';
import { CardModule } from './card/card.module';

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
    AuthModule,
    AuthRefreshTokenModule,
    VerificationModule,
    StorageModule,
    CryptoTxModule,
    AdminModule,
    RouterModule.register([
      {
        path: 'user',
        module: UserModule,
        children: [
          {
            path: 'person-profile',
            module: PersonProfileModule,
          },
          {
            path: 'enterprise-profile',
            module: EnterpriseProfileModule,
          },
          {
            path: 'document',
            module: DocumentModule,
          },
        ],
      },
      {
        path: 'beneficiary',
        module: BeneficiaryModule,
        children: [
          {
            path: 'user',
            module: BeneficiaryUserModule,
          },
          {
            path: 'wallet',
            module: BeneficiaryWalletModule,
          },
        ],
      },
      {
        path: 'country',
        module: CountryModule,
        children: [
          {
            path: 'activation',
            module: CountryActivationModule,
          },
          {
            path: 'fee',
            module: CountryFeeModule,
          },
        ],
      },
    ]),
    ShareholderModule,
    CountryActivationModule,
    CountryFeeModule,
    CardModule,
  ],
})
export class AppModule {}
