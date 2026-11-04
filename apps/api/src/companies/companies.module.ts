import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompanyMemberController } from './company-member.controller';
import { CompanyMembersService } from './company-members.service';
import { CompanyMemberEntity } from './entities/company-member.entity';
import { CompanyEntity } from './entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity, CompanyMemberEntity])],
  controllers: [CompaniesController, CompanyMemberController],
  providers: [CompaniesService, CompanyMembersService],
})
export class CompaniesModule {}
