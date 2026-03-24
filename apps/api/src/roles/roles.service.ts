import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../db/db.module';
import * as schema from '../db/schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @Inject(DB_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll() {
    const rolesData = await this.db.select({
      roleId: schema.roles.id,
      roleName: schema.roles.name,
      roleDescription: schema.roles.description,
      permissionId: schema.permissions.id,
      permissionCode: schema.permissions.code,
      permissionModule: schema.permissions.module,
      permissionAction: schema.permissions.action,
      permissionResource: schema.permissions.resource,
      permissionScope: schema.permissions.scope,
    })
    .from(schema.roles)
    .leftJoin(schema.role_permissions, eq(schema.roles.id, schema.role_permissions.role_id))
    .leftJoin(schema.permissions, eq(schema.role_permissions.permission_id, schema.permissions.id));

    const rolesMap = new Map<string, any>();
    for (const row of rolesData) {
      if (!rolesMap.has(row.roleId)) {
        rolesMap.set(row.roleId, {
          id: row.roleId,
          name: row.roleName,
          description: row.roleDescription,
          permissions: [],
        });
      }
      if (row.permissionId) {
        rolesMap.get(row.roleId).permissions.push({
          id: row.permissionId,
          code: row.permissionCode,
          module: row.permissionModule,
          action: row.permissionAction,
          resource: row.permissionResource,
          scope: row.permissionScope,
        });
      }
    }

    return Array.from(rolesMap.values());
  }

  async create(createRoleDto: CreateRoleDto) {
    const { name, description, permission_ids } = createRoleDto;

    return await this.db.transaction(async (tx) => {
      const [newRole] = await tx.insert(schema.roles)
        .values({ name, description })
        .returning();

      if (permission_ids && permission_ids.length > 0) {
        const values = permission_ids.map(pid => ({
          role_id: newRole.id,
          permission_id: pid,
        }));
        await tx.insert(schema.role_permissions).values(values);
      }

      return newRole;
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const { permission_ids } = updateRoleDto;

    return await this.db.transaction(async (tx) => {
      await tx.delete(schema.role_permissions).where(eq(schema.role_permissions.role_id, id));

      if (permission_ids && permission_ids.length > 0) {
        const values = permission_ids.map(pid => ({
          role_id: id,
          permission_id: pid,
        }));
        await tx.insert(schema.role_permissions).values(values);
      }

      const [updated] = await tx.select().from(schema.roles).where(eq(schema.roles.id, id));
      if (!updated) {
        throw new NotFoundException('Role not found');
      }
      
      return updated;
    });
  }
}
