import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import * as momemtTimezone from 'moment-timezone';
import { TIMEZONE_HEADER } from 'src/common/constants';

export const Timezone = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request: FastifyRequest = ctx.switchToHttp().getRequest();
    const timezoneHeader = request.headers[TIMEZONE_HEADER];

    const timezone =
      typeof timezoneHeader === 'string' &&
      momemtTimezone.tz.zone(timezoneHeader)
        ? timezoneHeader
        : 'UTC';

    return timezone;
  },
);
