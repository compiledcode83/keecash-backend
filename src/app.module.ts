import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { EnvHelper } from '@common/helpers/env.helper';
import appConfig from '@config/app.config';
import databaseConfig from '@config/database.config';
import jwtConfig from '@config/jwt.config';
import { validate } from '@common/validators/env.validator';
import verificationConfig from '@config/verification.config';
import storageConfig from '@config/storage.config';
import tripleAConfig from '@config/tripla-a.config';
import { AdminSubModule } from '@admin/admin.sub.module';
import { PublicSubModule } from '@api/public.sub.module';
import bridgecardConfig from '@config/bridgecard.config';

EnvHelper.verifyNodeEnv();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: EnvHelper.getEnvFilePath(),
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        verificationConfig,
        storageConfig,
        tripleAConfig,
        bridgecardConfig,
      ],
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
    AdminSubModule,
    PublicSubModule,
  ],
})
export class AppModule {}
