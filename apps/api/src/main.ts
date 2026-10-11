import {NestFactory, Reflector} from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module.js';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {BadRequestException, ClassSerializerInterceptor, ValidationError, ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter()
  );

  // Enable class serialization globally
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          return new BadRequestException(validationErrors);
        },
      }),
  );

  const config = new DocumentBuilder()
      .setTitle('Open Tracker API')
      .setDescription('The Open Tracker API description')
      .setVersion('0.1')
      .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
  // await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
await bootstrap();
