import { PartialType } from '@nestjs/swagger';

import { CompanyCreateDto } from './company-create.dto';

export class CompanyUpdateDto extends PartialType(CompanyCreateDto) {}
