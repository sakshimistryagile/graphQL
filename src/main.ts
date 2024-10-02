import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips unknown properties
      forbidNonWhitelisted: true, // Throw error on unknown properties
      transform: true, // Automatically transform payloads to match DTO types
    }),
  );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
