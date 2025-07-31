import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Failure } from 'src/common/types';

/**
 * Handles unknown errors or custom message/status and returns a standardized Failure tuple.
 * @param context context where returnException is calling
 * @param error Optional unknown error or message
 * @param status Optional HTTP status code (used only if `error` is string)
 * @returns Failure tuple: [null, HttpException]
 */
export function returnException(
  context: string,
  error?: unknown,
  status?: number,
): Failure {
  const logger = new Logger(context);

  let message = 'Internal Server Error';
  let finalStatus = status ?? HttpStatus.INTERNAL_SERVER_ERROR;

  if (typeof error === 'string') {
    message = error;
    finalStatus = status ?? HttpStatus.BAD_REQUEST;
  } else if (error instanceof HttpException) {
    finalStatus = error.getStatus();

    const response = error.getResponse();
    if (typeof response === 'string') {
      message = response;
    } else if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    ) {
      message = (response as { message: string }).message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'object' && error !== null) {
    const e = error as { message?: string; status?: number };
    message = e.message || message;
    finalStatus = e.status || finalStatus;
  }

  logger.error(message);

  return [null, new HttpException(message, finalStatus)];
}
