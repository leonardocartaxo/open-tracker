import { PartialType } from '@nestjs/swagger';

import { CompanyMemberDto } from './company-member.dto';

export class CompanyMemberUpdateDto extends PartialType(CompanyMemberDto) {}
