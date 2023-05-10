import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppBootstrapManager } from './app-bootstrap.manager';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  AppBootstrapManager.setAppDefaults(app);

  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('API Gateway documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('/api/v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3006);
}
bootstrap();
