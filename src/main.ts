import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  const config = await app.get(ConfigService);
  process.env.SECRET_KEY = config.get<string>('SECRET_KEY');
  const port = config.get<number>('API_PORT');
  await app.listen(port || 3000, () => {
    console.log('Server is running on port ' + port);
  });
}
bootstrap();
