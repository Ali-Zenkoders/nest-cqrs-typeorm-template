import { SetMetadata } from '@nestjs/common';
import { RESPONSE_MESSAGE_METADATA } from '../constants';

export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE_METADATA, message);
