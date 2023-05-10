import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { EnvHelper, validateApi } from '@app/env';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import storageConfig from '@app/common/configs/storage.config';
import tripleAConfig from '@app/common/configs/triple-a.config';
import bridgecardConfig from '@app/common/configs/bridgecard.config';
import twilioConfig from '@app/common/configs/twilio.config';
import sumsubConfig from '@app/common/configs/sumsub.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@app/database';
import { AuthModule } from './auth/auth.module';
import { BeneficiaryModule } from './beneficiary/beneficiary.module';
import { CardModule } from './card/card.module';
import { KeecashModule } from './keecash/keecash.module';
import { NotificationModule } from './notification/notification.module';
import { StorageModule } from './storage/storage.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';

EnvHelper.verifyNodeEnv();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: EnvHelper.getEnvFilePath(),
      isGlobal: true,
      load: [
        appConfig,
        jwtConfig,
        storageConfig,
        tripleAConfig,
        bridgecardConfig,
        sumsubConfig,
        twilioConfig,
      ],
      validate: validateApi,
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
    DatabaseModule,
    AuthModule,
    BeneficiaryModule,
    CardModule,
    KeecashModule,
    NotificationModule,
    StorageModule,
    TransactionModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
