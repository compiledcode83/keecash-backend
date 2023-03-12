import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerManager } from './swagger.manager';
import { AppBootstrapManager } from './app-bootstrap.manager';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  SwaggerManager.setSwaggerDefaults(app);

  AppBootstrapManager.setAppDefaults(app);

  await app.listen(process.env.PORT || 3006);
}
bootstrap();
