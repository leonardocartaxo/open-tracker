import { Injectable } from '@nestjs/common';
import { UserCreateDto } from './dtos/user-create.dto.js';
import { UserUpdateDto } from './dtos/user-update.dto.js';
import {UserDto} from "./dtos/user.dto.js";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserEntity} from "./entities/user.entity.js";

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(UserEntity)
      private usersRepository: Repository<UserEntity>,
  ) {}
  async create(userCreateDto: UserCreateDto): Promise<UserDto> {
    return this.usersRepository.save(userCreateDto);
  }

  async findAll(): Promise<UserDto[]> {
    return this.usersRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
      }
    });
  }

  async findOne(id: string): Promise<UserDto | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UserUpdateDto): Promise<UserDto> {
    return this.usersRepository.save(Object.assign({ id }, updateUserDto));
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete({ id });
  }
}
