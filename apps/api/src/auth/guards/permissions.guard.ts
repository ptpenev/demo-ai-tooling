import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_PERMISSION_KEY } from '../decorators/require-permission.decorator';
import { UsersService } from '../../users/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<{ action: string, resource: string, scope: string }>(
      REQUIRE_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    const permissions = await this.usersService.getUserPermissions(user.id);
    
    // Check if user has permission
    // A simplified check: match action and resource, and if scope isn't 'all', we might need to check project_id from request params/body
    // For T003, we just check if any active permission matches the required action and resource.
    const hasPermission = permissions.some((perm: any) => 
      perm.action === requiredPermission.action && 
      perm.resource === requiredPermission.resource &&
      (perm.scope === 'all' || perm.scope === requiredPermission.scope)
    );

    if (!hasPermission) {
      throw new ForbiddenException('You do not have the required permissions');
    }

    return true;
  }
}
