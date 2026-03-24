import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { eq } from 'drizzle-orm';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/internal_ops',
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log('Seeding database...');

  // 1. Create a Super Admin role
  const [adminRole] = await db.insert(schema.roles)
    .values({ name: 'Super Admin', description: 'Full system access' })
    .onConflictDoNothing()
    .returning();

  let adminRoleId = adminRole?.id;
  if (!adminRoleId) {
    const existingAdminRole = await db.query.roles.findFirst({ where: eq(schema.roles.name, 'Super Admin') });
    adminRoleId = existingAdminRole!.id;
  }

  // 2. Create full permissions
  const permissionsToCreate = [
    { code: 'admin:all', module: 'all', resource: 'all', action: 'all', scope: 'all' },
    { code: 'read:timesheet:all', module: 'timesheets', resource: 'timesheet', action: 'read', scope: 'all' },
    { code: 'create:project:all', module: 'projects', resource: 'project', action: 'create', scope: 'all' },
    { code: 'read:role:all', module: 'roles', resource: 'role', action: 'read', scope: 'all' },
    { code: 'create:role:all', module: 'roles', resource: 'role', action: 'create', scope: 'all' },
    { code: 'update:role:all', module: 'roles', resource: 'role', action: 'update', scope: 'all' },
    { code: 'update:user_roles:all', module: 'users', resource: 'user_roles', action: 'update', scope: 'all' },
  ];

  for (const perm of permissionsToCreate) {
    const [insertedPerm] = await db.insert(schema.permissions)
      .values(perm)
      .onConflictDoNothing()
      .returning();
      
    let permId = insertedPerm?.id;
    if (!permId) {
       const existing = await db.query.permissions.findFirst({ where: eq(schema.permissions.code, perm.code) });
       permId = existing!.id;
    }

    // Attach to Admin Role
    await db.insert(schema.role_permissions)
      .values({ role_id: adminRoleId, permission_id: permId })
      .onConflictDoNothing();
  }

  // 3. Create Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const [adminUser] = await db.insert(schema.users)
    .values({
      first_name: 'System',
      last_name: 'Admin',
      email: 'admin@company.com',
      password_hash: passwordHash,
    })
    .onConflictDoNothing()
    .returning();

  let adminUserId = adminUser?.id;
  if (!adminUserId) {
    const existing = await db.query.users.findFirst({ where: eq(schema.users.email, 'admin@company.com') });
    adminUserId = existing!.id;
  }

  // Assign role
  await db.insert(schema.user_roles)
    .values({ user_id: adminUserId, role_id: adminRoleId })
    .onConflictDoNothing();

  // Create some basic leave types required by the system
  await db.insert(schema.leave_types)
    .values([
      { name: 'paid', is_mandatory: true },
      { name: 'sick', is_mandatory: true },
      { name: 'unpaid', is_mandatory: false }
    ])
    .onConflictDoNothing();

  console.log('Seeding completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
