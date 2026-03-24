import { pgTable, uuid, varchar, text, boolean, timestamp, primaryKey, date, numeric } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  first_name: varchar('first_name', { length: 255 }).notNull(),
  last_name: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  description: text('description'),
});

export const permissions = pgTable('permissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 255 }).unique().notNull(),
  module: varchar('module', { length: 255 }).notNull(),
  resource: varchar('resource', { length: 255 }).notNull(),
  action: varchar('action', { length: 255 }).notNull(),
  scope: varchar('scope', { length: 50 }).notNull(), // own, team, project, all
  is_active: boolean('is_active').default(true).notNull(),
});

export const role_permissions = pgTable('role_permissions', {
  role_id: uuid('role_id').references(() => roles.id).notNull(),
  permission_id: uuid('permission_id').references(() => permissions.id).notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.role_id, table.permission_id] })
  }
});

export const user_roles = pgTable('user_roles', {
  id: uuid('id').defaultRandom().primaryKey(), // Surrogate key
  user_id: uuid('user_id').references(() => users.id).notNull(),
  role_id: uuid('role_id').references(() => roles.id).notNull(),
  project_id: uuid('project_id'), // Optional, for scoped roles
});

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('active').notNull(), // active, inactive, archived
  start_date: timestamp('start_date'),
  end_date: timestamp('end_date'),
});

export const project_members = pgTable('project_members', {
  project_id: uuid('project_id').references(() => projects.id).notNull(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  project_role: varchar('project_role', { length: 50 }).notNull(), // manager, lead, member
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.project_id, table.user_id] })
  }
});

export const timesheet_entries = pgTable('timesheet_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  project_id: uuid('project_id').references(() => projects.id).notNull(),
  date: date('date').notNull(),
  hours: numeric('hours', { precision: 5, scale: 2 }).notNull(),
  time_type: varchar('time_type', { length: 50 }).notNull(), // working_time, overtime, day_off, client_agreement
  comment: text('comment'),
  is_approved: boolean('is_approved').default(false).notNull(),
});
