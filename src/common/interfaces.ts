import { FastifyRequest } from 'fastify';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface ExtendedRequest extends FastifyRequest {
  successMessage?: string;
  user?: JwtPayload;
}

export interface GoogleOAuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  refreshToken: string;
}

export interface SuccessResponse<T = undefined> {
  message: string;
  data: T;
}
