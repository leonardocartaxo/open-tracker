import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UserRolesAllowed } from '../auth/decorators/user-roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRoleGuard } from '../auth/guards/user-role.guard';
import { UserCreateDto } from './dtos/user-create.dto';
import { UserUpdateDto } from './dtos/user-update.dto';
import { UserDto } from './dtos/user.dto';
import { UserRoles } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create an User' })
  @ApiResponse({ status: 200, description: 'The User has been successfully created.', type: UserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UserRolesAllowed(UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  create(@Body() createUserDto: UserCreateDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all Users' })
  @ApiResponse({ status: 200, description: 'The Users have been successfully found.', type: [UserDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UserRolesAllowed(UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a User by ID' })
  @ApiResponse({ status: 200, description: 'The User has been successfully found.', type: UserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UserRolesAllowed(UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a User' })
  @ApiResponse({ status: 200, description: 'The User has been successfully updated.', type: UserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UserRolesAllowed(UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UserUpdateDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a User' })
  @ApiResponse({ status: 200, description: 'The User has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UserRolesAllowed(UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
