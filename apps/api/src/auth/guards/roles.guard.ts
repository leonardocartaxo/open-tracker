import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRoles } from '../../users/entities/user.entity';
import { CurrentUser } from '../dtos/current-user.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const methodRole = this.reflector.get<UserRoles>('role', context.getHandler()) || [];
    const classRole = this.reflector.get<UserRoles>('role', context.getClass()) || [];

    if (!methodRole && !classRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: CurrentUser = request?.user;
    const allRoles = [methodRole, classRole];

    return allRoles?.every((it) => user?.role?.includes(it));
  }
}
