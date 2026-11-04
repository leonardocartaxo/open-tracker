import { OmitType } from '@nestjs/swagger';

import { CompanyMemberDto } from './company-member.dto';

export class CompanyMemberCreateDto extends OmitType(CompanyMemberDto, [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'isActive',
] as const) {}
