import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../../users/entities/user.entity.js';

export const RolesAllowed = (...roles: UserRoles[]) =>
  SetMetadata('roles', roles);
