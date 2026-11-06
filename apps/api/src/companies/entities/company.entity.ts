import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../../utils/base.entity';
import { CompanyMemberEntity } from './company-member.entity';

@Entity('companies')
export class CompanyEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => CompanyMemberEntity, (companyMemberEntity) => companyMemberEntity.company)
  companyMembers: CompanyMemberEntity[];
}
