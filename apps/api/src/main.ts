import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { configureApp } from './configure-app';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  configureApp(app);

  const config = new DocumentBuilder()
    .setTitle('Open Tracker API')
    .setDescription('The Open Tracker API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  // await app.listen(port, '0.0.0.0');

  Logger.log(`open-tracker listening on port ${port}`, 'Bootstrap');
  Logger.log(`Swagger docs available at /docs`, 'Bootstrap');
}

void bootstrap();
