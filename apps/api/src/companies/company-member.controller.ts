import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CompanyRolesAllowed } from '../auth/decorators/company-roles.decorator';
import { UserRolesAllowed } from '../auth/decorators/user-roles.decorator';
import { CompanyRoleGuard } from '../auth/guards/company-role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRoleGuard } from '../auth/guards/user-role.guard';
import { UserRoles } from '../users/entities/user.entity';
import { CompanyMembersService } from './company-members.service';
import { CompanyMemberCreateDto } from './dto/company-member-create.dto';
import { CompanyMemberUpdateDto } from './dto/company-member-update.dto';
import { CompanyMemberRole } from './entities/company-member.entity';

@Controller('company-members')
export class CompanyMemberController {
  constructor(private readonly companyMembersService: CompanyMembersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company member' })
  @ApiResponse({ status: 201, description: 'Company member created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UserRolesAllowed(UserRoles.ADMIN)
  @CompanyRolesAllowed(CompanyMemberRole.MANAGER)
  @UseGuards(JwtAuthGuard, CompanyRoleGuard)
  create(@Body() companyMemberCreateDto: CompanyMemberCreateDto) {
    return this.companyMembersService.create(companyMemberCreateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all company members' })
  @ApiResponse({ status: 200, description: 'Company members retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UserRolesAllowed(UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  findAll() {
    return this.companyMembersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a company member by ID' })
  @ApiResponse({ status: 200, description: 'Company member retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UserRolesAllowed(UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  findOne(@Param('id') id: string) {
    return this.companyMembersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company member' })
  @ApiResponse({ status: 200, description: 'Company member updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UserRolesAllowed(UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  update(@Param('id') id: string, @Body() companyMemberUpdateDto: CompanyMemberUpdateDto) {
    return this.companyMembersService.update(id, companyMemberUpdateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a company member' })
  @ApiResponse({ status: 200, description: 'Company member deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UserRolesAllowed(UserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  remove(@Param('id') id: string) {
    return this.companyMembersService.remove(id);
  }
}
