import { ApiProperty } from '@nestjs/swagger';

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
}
