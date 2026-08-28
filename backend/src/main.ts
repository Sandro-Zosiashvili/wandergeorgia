import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Only allow the frontend origin to call this API.
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN?.split(',').map((o) => o.trim()) ?? true,
    methods: ['POST'],
  });

  // Validate every incoming DTO; strip unknown fields; reject extras.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  Logger.log(`WanderGeorgia backend listening on http://localhost:${port}`, 'Bootstrap');
}

void bootstrap();
