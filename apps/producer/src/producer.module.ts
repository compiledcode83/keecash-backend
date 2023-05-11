import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EnvHelper, validateProducer } from '@app/env';
import { DatabaseModule } from '@app/database';
import kafkaConfig from '@app/common/configs/kafka.config';
import redisConfig from '@app/common/configs/redis.config';
import appConfig from './config/app.config';
import { KafkaProducerProvider } from './producer.provider';
import { ProducerService } from './producer.service';
import { ProducerTasks } from './producer.tasks';

EnvHelper.verifyNodeEnv();

const imports = [
  ConfigModule.forRoot({
    envFilePath: EnvHelper.getEnvFilePath(),
    isGlobal: true,
    load: [appConfig, kafkaConfig, redisConfig],
    validate: validateProducer,
  }),
  DatabaseModule,
];

if (!EnvHelper.isTest()) {
  imports.push(ScheduleModule.forRoot());
}

@Module({
  imports,
  providers: [ProducerService, KafkaProducerProvider, ProducerTasks],
  exports: [ProducerService],
})
export class ProducerModule {}
