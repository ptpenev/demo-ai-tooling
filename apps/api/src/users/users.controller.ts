import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { AssignRoleDto } from './dto/assign-role.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findById(req.user.id);
    const permissions = await this.usersService.getUserPermissions(req.user.id);
    
    return {
      data: {
        profile: {
          id: user?.id,
          first_name: user?.first_name,
          last_name: user?.last_name,
          email: user?.email,
          is_active: user?.is_active,
        },
        permissions,
      },
      meta: {},
      errors: []
    };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('update', 'user_roles', 'all')
  @Post(':id/roles')
  async assignRole(@Param('id') id: string, @Body() assignRoleDto: AssignRoleDto) {
    const result = await this.usersService.assignRole(id, assignRoleDto);
    return {
      data: result,
      meta: {},
      errors: []
    };
  }
}
