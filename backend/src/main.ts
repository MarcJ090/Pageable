import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'x-user-role'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(3000);
  console.log('🚀 Pageable backend running on http://localhost:3000');
}

bootstrap();