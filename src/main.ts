import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';

async function bootstrap() {
  const logger = new Logger('Server');
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });

  // Get app config for cors settings and starting the app.
  const appConfig: AppConfigService = app.get('AppConfigService');

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  // CORS
  if (appConfig.env === 'production') {
    logger.log(`CORS is activated!`);
    app.enableCors();
  }

  // Swagger OpenAPI Documentation
  const options = new DocumentBuilder()
    .setTitle('TeamSpeak Channelcreator')
    .setDescription('The TeamSpeak Channelcreator API description')
    .setVersion('1.0')
    .addTag('teamspeak')
    .addTag('assignment')
    .addTag('sync')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(appConfig.port);
  logger.log(`Application is running on port: ${appConfig.port}`);
}
bootstrap();
