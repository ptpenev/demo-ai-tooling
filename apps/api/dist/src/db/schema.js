"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_roles = exports.role_permissions = exports.permissions = exports.roles = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    first_name: (0, pg_core_1.varchar)('first_name', { length: 255 }).notNull(),
    last_name: (0, pg_core_1.varchar)('last_name', { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).unique().notNull(),
    password_hash: (0, pg_core_1.varchar)('password_hash', { length: 255 }).notNull(),
    is_active: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.roles = (0, pg_core_1.pgTable)('roles', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).unique().notNull(),
    description: (0, pg_core_1.text)('description'),
});
exports.permissions = (0, pg_core_1.pgTable)('permissions', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    code: (0, pg_core_1.varchar)('code', { length: 255 }).unique().notNull(),
    module: (0, pg_core_1.varchar)('module', { length: 255 }).notNull(),
    resource: (0, pg_core_1.varchar)('resource', { length: 255 }).notNull(),
    action: (0, pg_core_1.varchar)('action', { length: 255 }).notNull(),
    scope: (0, pg_core_1.varchar)('scope', { length: 50 }).notNull(),
    is_active: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
});
exports.role_permissions = (0, pg_core_1.pgTable)('role_permissions', {
    role_id: (0, pg_core_1.uuid)('role_id').references(() => exports.roles.id).notNull(),
    permission_id: (0, pg_core_1.uuid)('permission_id').references(() => exports.permissions.id).notNull(),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.role_id, table.permission_id] })
    };
});
exports.user_roles = (0, pg_core_1.pgTable)('user_roles', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    user_id: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id).notNull(),
    role_id: (0, pg_core_1.uuid)('role_id').references(() => exports.roles.id).notNull(),
    project_id: (0, pg_core_1.uuid)('project_id'),
});
//# sourceMappingURL=schema.js.map