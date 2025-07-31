import { join } from 'path';

export const ROLES_METADATA = 'roles';
export const RESPONSE_MESSAGE_METADATA = 'response_message';
export const SALT_ROUND = 12;
export const TEMPLATES_PATH = join(__dirname, '../../../public/templates');
export const OTP_EXPIRY = 15; // 15 minutes
export const TIMEZONE_HEADER = 'x-timezone';
