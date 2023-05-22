import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { EnvHelper, validateApi } from '@app/env';
import { DatabaseModule } from '@app/database';

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
