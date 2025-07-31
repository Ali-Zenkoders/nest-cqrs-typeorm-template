import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('POSTGRES_HOST'),
  port: configService.getOrThrow('POSTGRES_PORT'),
  username: configService.getOrThrow('POSTGRES_USER'),
  password: configService.getOrThrow('POSTGRES_PASSWORD'),
  database: configService.getOrThrow('POSTGRES_DB'),
  migrations: ['migrations/**'],
  entities: ['dist/**/*.entity.js'],
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
});
