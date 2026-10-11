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
  async create(UserCreateDto: UserCreateDto): Promise<UserDto> {
    return this.usersRepository.save(UserCreateDto);
  }

  async findAll(): Promise<UserDto[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<UserDto | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UserUpdateDto): Promise<UserDto> {
    return this.usersRepository.save({ ...updateUserDto, id });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete({ id });
  }
}
