import { Injectable, Inject } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../db/db.module';
import * as schema from '../db/schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DB_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findByEmail(email: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
    return user;
  }

  async findById(id: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });
    return user;
  }

  async getUserPermissions(userId: string) {
    const userRoles = await this.db.query.user_roles.findMany({
      where: eq(schema.user_roles.user_id, userId),
    });

    if (!userRoles.length) return [];

    const roleIds = userRoles.map((ur) => ur.role_id);

    const rolePermissions = await this.db.query.role_permissions.findMany({
      where: inArray(schema.role_permissions.role_id, roleIds),
      with: {
        permission_id: true, // We need to do a join properly
      }
    });

    // Actually, since we need permissions, we should write a proper Drizzle join query.
    return this.db
      .select({
        action: schema.permissions.action,
        resource: schema.permissions.resource,
        scope: schema.permissions.scope,
      })
      .from(schema.permissions)
      .innerJoin(schema.role_permissions, eq(schema.role_permissions.permission_id, schema.permissions.id))
      .innerJoin(schema.user_roles, eq(schema.user_roles.role_id, schema.role_permissions.role_id))
      .where(eq(schema.user_roles.user_id, userId));
  }
}
