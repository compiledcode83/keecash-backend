import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { EnvHelper } from '@app/env';
import { WebhookModule } from './webhook.module';
import { InternalServerErrorExceptionsFilter } from '@app/common';

EnvHelper.verifyNodeEnv();

dotenv.config({ path: EnvHelper.getEnvFilePath() });

async function bootstrap() {
  const app = await NestFactory.create(WebhookModule);

  app.useGlobalFilters(new InternalServerErrorExceptionsFilter());
  app.enableShutdownHooks();

  await app.listen(3001);
}
bootstrap();
