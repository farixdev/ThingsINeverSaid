import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfessionsService } from './confessions/confessions.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Seed database on startup
  const confessionsService = app.get(ConfessionsService);
  await confessionsService.seed();

  await app.listen(3333);
  console.log(`\n✦ Things I Never Said — Backend running on http://localhost:3333\n`);
}
bootstrap();
