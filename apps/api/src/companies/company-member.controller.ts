import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { RolesAllowed } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRoles } from '../users/entities/user.entity';
import { CompanyMembersService } from './company-members.service';
import { CompanyMemberCreateDto } from './dto/company-member-create.dto';
import { CompanyMemberUpdateDto } from './dto/company-member-update.dto';

@Controller('company-members')
export class CompanyMemberController {
  constructor(private readonly companyMembersService: CompanyMembersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company member' })
  @ApiResponse({ status: 201, description: 'Company member created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAllowed(UserRoles.ADMIN)
  create(@Body() companyMemberCreateDto: CompanyMemberCreateDto) {
    return this.companyMembersService.create(companyMemberCreateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all company members' })
  @ApiResponse({ status: 200, description: 'Company members retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAllowed(UserRoles.ADMIN)
  findAll() {
    return this.companyMembersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a company member by ID' })
  @ApiResponse({ status: 200, description: 'Company member retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAllowed(UserRoles.ADMIN)
  findOne(@Param('id') id: string) {
    return this.companyMembersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company member' })
  @ApiResponse({ status: 200, description: 'Company member updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAllowed(UserRoles.ADMIN)
  update(@Param('id') id: string, @Body() companyMemberUpdateDto: CompanyMemberUpdateDto) {
    return this.companyMembersService.update(id, companyMemberUpdateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a company member' })
  @ApiResponse({ status: 200, description: 'Company member deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAllowed(UserRoles.ADMIN)
  remove(@Param('id') id: string) {
    return this.companyMembersService.remove(id);
  }
}
