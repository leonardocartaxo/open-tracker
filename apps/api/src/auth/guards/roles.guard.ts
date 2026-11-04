import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRoles } from '../../users/entities/user.entity';
import { CurrentUser } from '../dtos/current-user.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const methodRoles = this.reflector.get<UserRoles[]>('roles', context.getHandler()) || [];
    const classRoles = this.reflector.get<UserRoles[]>('roles', context.getClass()) || [];

    if (!methodRoles && !classRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: CurrentUser = request?.user;
    const allRoles = [...methodRoles, ...classRoles];

    return allRoles?.every((it) => user?.roles?.includes(it));
  }
}
