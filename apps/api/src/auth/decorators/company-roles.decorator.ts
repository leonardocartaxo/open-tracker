import { SetMetadata } from '@nestjs/common';

import { CompanyMemberRole } from '../../companies/entities/company-member.entity';

export const CompanyRolesAllowed = (...roles: CompanyMemberRole[]) => SetMetadata('companyMemberRoles', roles);
