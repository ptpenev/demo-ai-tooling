import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('api/v1/roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RequirePermission('read', 'role', 'all')
  async findAll() {
    const result = await this.rolesService.findAll();
    return {
      data: result,
      meta: {},
      errors: [],
    };
  }

  @Post()
  @RequirePermission('create', 'role', 'all')
  async create(@Body() createRoleDto: CreateRoleDto) {
    const result = await this.rolesService.create(createRoleDto);
    return {
      data: result,
      meta: {},
      errors: [],
    };
  }

  @Patch(':id')
  @RequirePermission('update', 'role', 'all')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const result = await this.rolesService.update(id, updateRoleDto);
    return {
      data: result,
      meta: {},
      errors: [],
    };
  }
}
