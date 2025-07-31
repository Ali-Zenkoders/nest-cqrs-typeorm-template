import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: Logger = new Logger(LoggerMiddleware.name);
  constructor() {}

  use(
    req: FastifyRequest['raw'],
    res: FastifyReply['raw'],
    next: () => void,
  ): void {
    const start = Date.now();

    res.on('finish', () => {
      const elapsed = Date.now() - start;
      const timestamp = new Date().toISOString();
      const method = req.method;
      const url = req.url;
      const statusCode = res.statusCode;

      const message = `[${timestamp}] ${method} ${url} ${statusCode} - ${elapsed}ms`;

      if (statusCode >= 500) {
        this.logger.error(message);
      } else if (statusCode >= 400) {
        this.logger.warn(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
