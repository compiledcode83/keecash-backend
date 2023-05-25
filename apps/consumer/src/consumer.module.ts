import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvHelper, validateConsumer } from '@app/env';
import { DatabaseModule } from '@app/database';
import { UserModule } from '@app/user';
import { TwilioModule } from '@app/twilio';
import { BridgecardModule } from '@app/bridgecard';
import { TransactionModule } from '@app/transaction';
import { OutboxModule } from '@app/outbox';
import { PricingModule } from '@app/pricing';
import { NotificationModule } from '@app/notification';
import twilioConfig from '@app/common/configs/twilio.config';
import bridgecardConfig from '@app/common/configs/bridgecard.config';
import tripleAConfig from '@app/common/configs/triple-a.config';
import kafkaConfig from '@app/common/configs/kafka.config';
import appConfig from './config/app.config';
import { ConsumerService } from './consumer.service';
import { ConsumerController } from './consumer.controller';

EnvHelper.verifyNodeEnv();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: EnvHelper.getEnvFilePath(),
      isGlobal: true,
      load: [appConfig, kafkaConfig, twilioConfig, bridgecardConfig, tripleAConfig],
      validate: validateConsumer,
    }),
    DatabaseModule,
    UserModule,
    TwilioModule,
    BridgecardModule,
    TransactionModule,
    OutboxModule,
    PricingModule,
    NotificationModule,
  ],
  providers: [ConsumerService],
  controllers: [ConsumerController],
  exports: [ConsumerService],
})
export class ConsumerModule {}
