import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvHelper, validateWebhook } from '@app/env';
import appConfig from './config/app.config';
import tripleAConfig from '@app/common/configs/triple-a.config';
import bridgecardConfig from '@app/common/configs/bridgecard.config';
import sumsubConfig from '@app/common/configs/sumsub.config';
import { DatabaseModule } from '@app/database';
import { BridgecardWebhookModule } from './bridgecard/bridgecard.module';
import { SumsubWebhookModule } from './sumsub/sumsub.module';
import { TripleAWebhookModule } from './triple-a/triple-a.module';

EnvHelper.verifyNodeEnv();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: EnvHelper.getEnvFilePath(),
      isGlobal: true,
      load: [appConfig, tripleAConfig, bridgecardConfig, sumsubConfig],
      validate: validateWebhook,
    }),
    DatabaseModule,
    BridgecardWebhookModule,
    SumsubWebhookModule,
    TripleAWebhookModule,
  ],
})
export class WebhookModule {}
