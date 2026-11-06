import { SetMetadata } from '@nestjs/common';

import { UserRoles } from '../../users/entities/user.entity';

export const UserRolesAllowed = (...roles: UserRoles[]) => SetMetadata('userRoles', roles);
