import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../utils/base.entity';

export enum UserRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity()
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  hashedPassword: string;

  @Column()
  name: string;

  @Column({
    array: true,
    type: 'enum',
    enum: Object.values(UserRoles),
    default: [UserRoles.USER],
    comment: 'enum:{USER, ADMIN}',
  })
  roles: UserRoles[] = [UserRoles.USER];
}
