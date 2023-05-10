import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvHelper, validateConsumer } from '@app/env';
import { DatabaseModule } from '@app/database';
import kafkaConfig from '@app/common/configs/kafka.config';
import redisConfig from '@app/common/configs/redis.config';
import { ConsumerService } from './consumer.service';
import { ConsumerController } from './consumer.controller';
import appConfig from './config/app.config';

EnvHelper.verifyNodeEnv();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: EnvHelper.getEnvFilePath(),
      isGlobal: true,
      load: [appConfig, kafkaConfig, redisConfig],
      validate: validateConsumer,
    }),
    DatabaseModule,
  ],
  providers: [ConsumerService],
  controllers: [ConsumerController],
  exports: [ConsumerService],
})
export class ConsumerModule {}
