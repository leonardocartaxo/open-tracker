import { OmitType } from '@nestjs/swagger';

import { CompanyDto } from './company.dto';

export class CompanyCreateDto extends OmitType(CompanyDto, [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'isActive',
] as const) {}
