import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { InternalServerErrorExceptionsFilter } from '@app/common';
import { EnvHelper } from '@app/env';
import { ProducerModule } from './producer.module';

EnvHelper.verifyNodeEnv();

dotenv.config({ path: EnvHelper.getEnvFilePath() });

async function bootstrap() {
  const app = await NestFactory.create(ProducerModule);

  app.useGlobalFilters(new InternalServerErrorExceptionsFilter());
  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3003);
}
bootstrap();
