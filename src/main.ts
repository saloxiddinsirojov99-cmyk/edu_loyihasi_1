import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

// super admin emaili saloxiddinsirojov99@gmail.com 
// parol shaftoli

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const config = new DocumentBuilder()
    .setTitle('Edu Center API')
    .setDescription('Backend APIlari')
    .addBearerAuth(                  
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',         
        name: 'Authorization'
      },
      'access-token' 
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document); 

  await app.listen(3000);
}
bootstrap(); 