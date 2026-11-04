import { SetMetadata } from '@nestjs/common';

import { UserRoles } from '../../users/entities/user.entity';

export const RolesAllowed = (...roles: UserRoles[]) => SetMetadata('roles', roles);
