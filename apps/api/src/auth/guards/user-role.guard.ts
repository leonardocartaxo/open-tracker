import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRoles } from '../../users/entities/user.entity';
import { CurrentUser } from '../dtos/current-user.dto';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userMethodRoles = this.reflector.get<UserRoles[]>('userRoles', context.getHandler()) || [];
    const userClassRoles = this.reflector.get<UserRoles[]>('userRoles', context.getClass()) || [];

    if (!userMethodRoles && !userClassRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: CurrentUser = request.user;

    const allUserRoles = [...userMethodRoles, ...userClassRoles];

    return allUserRoles?.some((userRole) => user?.role?.includes(userRole));
  }
}
