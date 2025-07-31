import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import { VersioningType } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const config = app.get(ConfigService);
  const reflector = app.get(Reflector);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: config.getOrThrow('API_VERSION'),
    prefix: 'v',
  });

  app.useStaticAssets({
    root: join(__dirname, '..', '..', 'public'),
    prefix: '/',
  });

  const theme = new SwaggerTheme();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Wedzie API')
    .setDescription('Backend API for Wedzie, a wedding arrangement platform')
    .setVersion('1.0.0')
    .setContact(
      'Wedzie Support',
      'https://wedzie.com/support',
      'support@wedzie.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setExternalDoc('Postman Collection', 'http://localhost:8000/docs-json')
    .addBearerAuth()
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`/docs`, app, documentFactory, {
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
    customfavIcon: '/favicon.ico',
  });

  app.use(
    '/reference',
    apiReference({
      content: documentFactory,
      withFastify: true,
      customfavIcon: '/favicon.ico',
    }),
  );

  await app.register(fastifyHelmet, { contentSecurityPolicy: false });

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Security: Rate Limiting
  const ONE_HUNDRED_REQUESTS = 100;
  await app.register(fastifyRateLimit, {
    max: ONE_HUNDRED_REQUESTS,
    timeWindow: '1 minute',
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor(reflector, config));

  await app.listen(
    config.getOrThrow('PORT') ?? 3000,
    config.getOrThrow('SERVER_ACCESS_IP'),
  );
}
bootstrap().catch((error) => {
  console.error('Application failed to start: ', error);
  process.exit(1);
});
