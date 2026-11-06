import { ApiProperty } from '@nestjs/swagger';

import { CompanyMemberDto } from '../../companies/dto/company-member.dto';
import { UserRoles } from '../../users/entities/user.entity';

export class CurrentUser {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: UserRoles;

  @ApiProperty()
  companyMembers: CompanyMemberDto[];
}
