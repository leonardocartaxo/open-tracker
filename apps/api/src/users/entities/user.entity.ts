import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { CompanyMemberEntity } from '../../companies/entities/company-member.entity';
import { enumColumnType } from '../../database/column-types';
import { BaseEntity } from '../../utils/base.entity';

export enum UserRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity('users')
@Unique(['email'])
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  hashedPassword: string;

  @Column()
  name: string;

  @Column({
    type: enumColumnType,
    enum: Object.values(UserRoles),
    default: UserRoles.USER,
    comment: 'enum:{USER, ADMIN}',
  })
  role: UserRoles = UserRoles.USER;

  @OneToMany(() => CompanyMemberEntity, (companyMemberEntity) => companyMemberEntity.user)
  companyMembers: CompanyMemberEntity[];
}
