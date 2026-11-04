import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

import { UserEntity, UserRoles } from '../entities/user.entity';

export class UserDto implements Omit<UserEntity, 'hashedPassword'> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({
    default: 'john-doe@example.com',
    nullable: false,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    default: 'John Doe',
    nullable: false,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    default: [UserRoles.USER],
    nullable: false,
  })
  roles: UserRoles[];
}
