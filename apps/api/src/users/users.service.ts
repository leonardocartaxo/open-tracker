import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserCreateDto } from './dtos/user-create.dto';
import { UserUpdateDto } from './dtos/user-update.dto';
import { UserDto } from './dtos/user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(userCreateDto: UserCreateDto): Promise<UserDto> {
    return this.usersRepository.save(this.usersRepository.create(userCreateDto));
  }

  async findAll(): Promise<UserDto[]> {
    return this.usersRepository.find({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
        deletedAt: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  async findOne(id: string): Promise<UserDto | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string, relations?: any): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { email }, relations });
  }

  async update(id: string, updateUserDto: UserUpdateDto): Promise<UserDto | null> {
    await this.usersRepository.save(Object.assign({ id }, updateUserDto));

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete({ id });
  }
}
