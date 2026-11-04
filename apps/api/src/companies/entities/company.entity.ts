import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../utils/base.entity';

@Entity('companies')
export class CompanyEntity extends BaseEntity {
  @Column()
  name: string;
}
