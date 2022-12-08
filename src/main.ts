import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Aqui validos mis Dtos a nivel global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Si envio parametros que esten demas, el backend no lo va a recibir
      forbidNonWhitelisted: process.env.NODE_ENV === 'PROD' ? false : true, //Aqui si me llegan paramtros demas aviso el error
      transform: true, //Aqui transformos los query para que me lleguen en su formato
      transformOptions: {
        enableImplicitConversion: true, //Aqui transformo para que los query me lleguen en su formato
      },
    }),
  );
  app.use(cookieParser());
  await app.listen(3000, () => {
    console.log('Server Arriba');
  });
}
bootstrap();
