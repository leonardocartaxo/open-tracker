import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';
import { BaseEntity } from '../../utils/base.entity';
import { CompanyEntity } from './company.entity';

export enum CompanyMemberRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  VIEWER = 'VIEWER',
}

@Unique(['userId', 'companyId'])
@Entity('companyMembers')
export class CompanyMemberEntity extends BaseEntity {
  @Column()
  companyId: string;

  @ManyToOne(() => CompanyEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  company: CompanyEntity;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column({
    default: CompanyMemberRole.VIEWER,
    type: 'enum',
    enum: CompanyMemberRole,
    comment: 'enum: { OWNER, MANAGER, VIEWER }',
  })
  role: CompanyMemberRole = CompanyMemberRole.VIEWER;
}
