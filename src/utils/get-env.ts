import { ConfigService } from '@nestjs/config';

export function getEnv(config: ConfigService, key: string): string {
  return config.getOrThrow<string>(key);
}
