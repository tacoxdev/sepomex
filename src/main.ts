import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  applyHttpSecurity,
  isSwaggerEnabled,
  parseAllowedOrigins,
} from './security/http-security';

async function bootstrap() {
  const allowedOrigins = parseAllowedOrigins(process.env.ALLOWED_ORIGIN);
  const swaggerEnabled = isSwaggerEnabled(process.env.STAGE);
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  applyHttpSecurity(app, { allowedOrigins, swaggerEnabled });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );
  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('SEPOMEX')
      .setDescription('API for managing postal codes in Mexico')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
