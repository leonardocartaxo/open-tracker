import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CompanyMemberCreateDto } from '../../companies/dto/company-member-create.dto';
import { CompanyMemberRole } from '../../companies/entities/company-member.entity';
import { UserRoles } from '../../users/entities/user.entity';
import { CurrentUser } from '../dtos/current-user.dto';

@Injectable()
export class CompanyRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userMethodRoles = this.reflector.get<UserRoles[]>('userRoles', context.getHandler()) || [];
    const userClassRoles = this.reflector.get<UserRoles[]>('userRoles', context.getClass()) || [];
    const companyMemberMethodRoles =
      this.reflector.get<CompanyMemberRole[]>('companyMemberRoles', context.getHandler()) || [];
    const companyMemberClassRoles =
      this.reflector.get<CompanyMemberRole[]>('companyMemberRoles', context.getClass()) || [];

    if (!userMethodRoles && !userClassRoles && !companyMemberMethodRoles && !companyMemberClassRoles) {
      return true;
    }

    const allUserRoles = [...userMethodRoles, ...userClassRoles];
    const companyMemberRoles = [...companyMemberMethodRoles, ...companyMemberClassRoles];
    const request = context.switchToHttp().getRequest();
    const user: CurrentUser = request.user;
    const body = request.body as CompanyMemberCreateDto;

    return (
      allUserRoles?.some((userRole) => user?.role?.includes(userRole)) ||
      companyMemberRoles?.some((companyMemberRole) =>
        user?.companyMembers?.some((cm) => cm.companyId === body.companyId && cm.role === companyMemberRole),
      )
    );
  }
}
