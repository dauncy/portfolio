import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  const address = process.env.ADDRESS || '0.0.0.0';
  app.enableCors();
  await app.listen(port, address);
}
bootstrap();
