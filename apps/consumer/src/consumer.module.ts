import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvHelper, validateConsumer } from '@app/env';
import { DatabaseModule } from '@app/database';
import { UserModule } from '@app/user';
import { TwilioModule } from '@app/twilio';
import { BridgecardModule } from '@app/bridgecard';
import kafkaConfig from '@app/common/configs/kafka.config';
import { ConsumerService } from './consumer.service';
import appConfig from './config/app.config';
import twilioConfig from '@app/common/configs/twilio.config';
import { ConsumerController } from './consumer.controller';

EnvHelper.verifyNodeEnv();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: EnvHelper.getEnvFilePath(),
      isGlobal: true,
      load: [appConfig, kafkaConfig, twilioConfig],
      validate: validateConsumer,
    }),
    DatabaseModule,
    UserModule,
    TwilioModule,
    BridgecardModule,
  ],
  providers: [ConsumerService],
  controllers: [ConsumerController],
  exports: [ConsumerService],
})
export class ConsumerModule {}
