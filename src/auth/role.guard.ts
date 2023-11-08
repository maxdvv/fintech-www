import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());

    if (!requiredRoles?.length) {
      return true;
    }

    const { session } = context.switchToHttp().getRequest();

    return requiredRoles.some((role) => session.role === role);
  }
}
