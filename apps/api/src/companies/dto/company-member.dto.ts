import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '../../users/entities/user.entity';
import { CompanyMemberEntity, CompanyMemberRole } from '../entities/company-member.entity';
import { CompanyEntity } from '../entities/company.entity';

export class CompanyMemberDto implements CompanyMemberEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  company: CompanyEntity;

  @ApiProperty()
  companyId: string;

  @ApiProperty({
    default: CompanyMemberRole.VIEWER,
    nullable: false,
  })
  role: CompanyMemberRole;

  @ApiProperty()
  user: UserEntity;

  @ApiProperty()
  userId: string;
}
