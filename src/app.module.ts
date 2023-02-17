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
import { FeeModule } from './fee/fee.module';
import { BeneficiaryModule } from './beneficiary/beneficiary.module';
import { AdminModule } from './admin/admin.module';
import { CountryModule } from './country/country.module';
import { DocumentModule } from './document/document.module';
import { EnterpriseProfileModule } from './enterprise-profile/enterprise-profile.module';
import { PersonProfileModule } from './person-profile/person-profile.module';
import { ShareholderModule } from './shareholder/shareholder.module';
import verificationConfig from './config/verification.config';
import storageConfig from './config/storage.config';
import cryptoConfig from './config/crypto.config';

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
    UserModule,
    AuthModule,
    AuthRefreshTokenModule,
    VerificationModule,
    StorageModule,
    CryptoTxModule,
    FeeModule,
    BeneficiaryModule,
    AdminModule,
    CountryModule,
    DocumentModule,
    EnterpriseProfileModule,
    PersonProfileModule,
    ShareholderModule,
  ],
})
export class AppModule {}
