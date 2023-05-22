import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { json } from 'express';
import { useContainer } from 'class-validator';
import { InternalServerErrorExceptionsFilter } from '@app/common';
import { AppModule } from './webhook.module';

export class AppBootstrapManager {
  static getTestingModuleBuilder(): TestingModuleBuilder {
    return Test.createTestingModule({
      imports: [AppModule],
    });
  }

  static setAppDefaults(app: INestApplication): INestApplication {
    useContainer(app.select(AppModule), {
      fallbackOnErrors: true,
      fallback: true,
    });

    app
      .use(json({ limit: '50mb' }))
      .setGlobalPrefix('api/v1')
      .useGlobalFilters(new InternalServerErrorExceptionsFilter())
      .useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          validationError: {
            target: false,
          },
          stopAtFirstError: true,
        }),
      );
    // .enableCors({
    //   origin: ['https://keecash-frontend-admin-nc7jsr3m4a-od.a.run.app', 'http://localhost:3002'],
    //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    //   credentials: true,
    // });

    return app;
  }
}
