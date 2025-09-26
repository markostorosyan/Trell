import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT_NUMBER;

  await app.listen(port);
  console.log(`app run in port ${port}`);
}
bootstrap().catch((err) => console.error(err));
