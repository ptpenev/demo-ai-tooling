import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, inArray, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../db/db.module';
import * as schema from '../db/schema';
import { AssignRoleDto } from './dto/assign-role.dto';

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

  async assignRole(userId: string, assignRoleDto: AssignRoleDto) {
    const { role_id, project_id } = assignRoleDto;

    // Verify user exists
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify role exists
    const role = await this.db.query.roles.findFirst({
      where: eq(schema.roles.id, role_id),
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Check if assignment already exists
    const conditions = [
      eq(schema.user_roles.user_id, userId),
      eq(schema.user_roles.role_id, role_id),
    ];
    
    if (project_id) {
      conditions.push(eq(schema.user_roles.project_id, project_id));
    }

    const existing = await this.db.query.user_roles.findFirst({
      where: and(...conditions),
    });

    if (existing) {
      return existing; // already assigned
    }

    const [assignment] = await this.db.insert(schema.user_roles)
      .values({
        user_id: userId,
        role_id: role_id,
        project_id: project_id || null,
      })
      .returning();

    return assignment;
  }
}
