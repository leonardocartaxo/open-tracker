import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CompanyMemberCreateDto } from './dto/company-member-create.dto';
import { CompanyMemberUpdateDto } from './dto/company-member-update.dto';
import { CompanyMemberDto } from './dto/company-member.dto';
import { CompanyMemberEntity } from './entities/company-member.entity';

@Injectable()
export class CompanyMembersService {
  constructor(
    @InjectRepository(CompanyMemberEntity)
    private companyMemberEntityRepository: Repository<CompanyMemberEntity>,
  ) {}

  async create(companyMemberCreateDto: CompanyMemberCreateDto): Promise<CompanyMemberDto> {
    return this.companyMemberEntityRepository.save(companyMemberCreateDto);
  }

  async findAll(): Promise<CompanyMemberDto[]> {
    return this.companyMemberEntityRepository.find();
  }

  async findOne(id: string): Promise<CompanyMemberDto | null> {
    return this.companyMemberEntityRepository.findOneBy({ id });
  }

  async update(id: string, companyMemberUpdateDto: CompanyMemberUpdateDto): Promise<CompanyMemberDto | null> {
    await this.companyMemberEntityRepository.update({ id }, companyMemberUpdateDto);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.companyMemberEntityRepository.delete({ id });
  }
}
