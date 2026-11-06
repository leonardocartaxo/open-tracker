import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CompanyCreateDto } from './dto/company-create.dto';
import { CompanyUpdateDto } from './dto/company-update.dto';
import { CompanyDto } from './dto/company.dto';
import { CompanyEntity } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyEntity)
    private companiesRepository: Repository<CompanyEntity>,
  ) {}

  async create(createCompanyDto: CompanyCreateDto): Promise<CompanyDto> {
    return this.companiesRepository.save(createCompanyDto);
  }

  async findAll(): Promise<CompanyDto[]> {
    return this.companiesRepository.find();
  }

  async findOne(id: string): Promise<CompanyDto | null> {
    return this.companiesRepository.findOneBy({ id });
  }

  async update(id: string, updateCompanyDto: CompanyUpdateDto): Promise<CompanyEntity | null> {
    await this.companiesRepository.update({ id }, updateCompanyDto);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.companiesRepository.delete({ id });
  }
}
