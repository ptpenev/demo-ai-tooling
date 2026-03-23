import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
}
