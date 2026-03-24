import { SetMetadata } from '@nestjs/common';

export const REQUIRE_PERMISSION_KEY = 'require_permission';
export const RequirePermission = (action: string, resource: string, scope: string = 'all') =>
  SetMetadata(REQUIRE_PERMISSION_KEY, { action, resource, scope });
