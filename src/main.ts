import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { FirebaseService } from './shared/services/firebase/firebase.service';
import { ValidationPipe } from '@nestjs/common';
import { HttpMiddleware } from './middlewares/http/http.middleware';
import { AllExceptionsFilter } from './middlewares/exceptions/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  new FirebaseService().initialize();
  app.use(cookieParser());
  app.use(new HttpMiddleware().use);
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
