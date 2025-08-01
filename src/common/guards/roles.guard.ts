import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_METADATA } from '../constants';
import { JwtPayload } from '../interfaces';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: string[], userRole?: string) {
    return roles.some((role) => role === userRole);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: string[] = this.reflector.get(
      ROLES_METADATA,
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    const request: { user?: JwtPayload } = context.switchToHttp().getRequest();
    const user = request?.user;

    return this.matchRoles(roles, user?.role);
  }
}
