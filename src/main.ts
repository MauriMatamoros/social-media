import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

let PORT: string;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  PORT = process.env.PORT;
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors();
  app.use(helmet());
  const config = new DocumentBuilder()
    .setTitle('Nicasource Assessment')
    .addBearerAuth()
    .setDescription('A video social media')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(PORT);
}
bootstrap().then(() => console.log(`Running on port: ${PORT}`));
