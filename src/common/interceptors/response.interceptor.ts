import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { format } from 'date-fns';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RESPONSE_MESSAGE_METADATA } from '../constants';
import { HttpException } from '@nestjs/common';

export type Response<T> = {
  status: boolean;
  statusCode: number;
  path: string;
  message: string;
  data?: T;
  timestamp: string;
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    return next.handle().pipe(
      map((res: T) => {
        const statusCode = response.statusCode;

        // If the controller returned an HttpException object directly
        if (res instanceof HttpException) {
          const exceptionResponse = res.getResponse();
          const exceptionStatus = res.getStatus();
          const message =
            typeof exceptionResponse === 'string'
              ? exceptionResponse
              : (exceptionResponse as Record<string, string | undefined>)
                  .message || 'Error';

          return {
            status: false,
            statusCode: exceptionStatus,
            path: request.url,
            message,
            ...(this.configService.get<string>('ENVIRONMENT') && {
              data: exceptionResponse as T,
            }),
            timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          };
        }

        // Normal response
        const successMessage =
          this.reflector.get<string>(
            RESPONSE_MESSAGE_METADATA,
            context.getHandler(),
          ) ?? 'Success';

        return {
          status: true,
          statusCode,
          path: request.url,
          message: successMessage,
          data: res,
          timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        };
      }),
    );
  }
}
