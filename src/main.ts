import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';

async function main() {
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);

  app.enableCors(
    { 
      origin: '*' ,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',

    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(envs.port);

  logger.log(`Server running on port ${envs.port}`);
}
main();
