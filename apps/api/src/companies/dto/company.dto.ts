import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { CompanyEntity } from '../entities/company.entity';
import { CompanyMemberDto } from './company-member.dto';

export class CompanyDto implements CompanyEntity {
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

  @ApiProperty({
    default: 'My Company',
    nullable: false,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  companyMembers: CompanyMemberDto[];
}
