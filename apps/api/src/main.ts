import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppBootstrapManager } from './app-bootstrap.manager';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  AppBootstrapManager.setAppDefaults(app);

  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('API Gateway documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
