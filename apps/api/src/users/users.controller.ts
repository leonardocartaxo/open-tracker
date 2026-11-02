import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import {RolesAllowed} from '../auth/decorators/roles.decorator.js';
import {RolesGuard} from '../auth/guards/roles.guard.js';
import {UserRoles} from './entities/user.entity.js';
import { UsersService } from './users.service.js';
import { UserCreateDto } from './dtos/user-create.dto.js';
import { UserUpdateDto } from './dtos/user-update.dto.js';
import {ApiBearerAuth, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {UserDto} from "./dtos/user.dto.js";
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create an User' })
  @ApiResponse({ status: 200, description: 'The User has been successfully created.', type: UserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAllowed(UserRoles.ADMIN)
  create(@Body() createUserDto: UserCreateDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all Users' })
  @ApiResponse({ status: 200, description: 'The Users have been successfully found.', type: [UserDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAllowed(UserRoles.ADMIN)
  findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a User by ID' })
  @ApiResponse({ status: 200, description: 'The User has been successfully found.', type: UserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAllowed(UserRoles.USER)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a User' })
  @ApiResponse({ status: 200, description: 'The User has been successfully updated.', type: UserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAllowed(UserRoles.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UserUpdateDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a User' })
  @ApiResponse({ status: 200, description: 'The User has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAllowed(UserRoles.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
