import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost', 'http://127.0.0.1'],
    credentials: true,
  });
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}
bootstrap();
