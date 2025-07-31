import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('POSTGRES_HOST'),
        port: configService.getOrThrow('POSTGRES_PORT'),
        username: configService.getOrThrow('POSTGRES_USER'),
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        database: configService.getOrThrow('POSTGRES_DB'),
        autoLoadEntities: true,
        logging: false,
        // On local development, we don't have SSL enabled
        // On staging/production we have SSL enabled
        // rejectUnauthorized: false is a workaround to make SSL work without adding the CA certificate
        extra:
          configService.get('POSTGRES_SSL') === 'true'
            ? {
                ssl: {
                  rejectUnauthorized: false,
                },
              }
            : {},
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
