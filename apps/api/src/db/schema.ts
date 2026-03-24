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

export const leave_types = pgTable('leave_types', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  is_mandatory: boolean('is_mandatory').default(false).notNull(),
});

export const leave_requests = pgTable('leave_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  leave_type_id: uuid('leave_type_id').references(() => leave_types.id).notNull(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  days: numeric('days', { precision: 5, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, approved, rejected
  approver_id: uuid('approver_id').references(() => users.id),
  requester_signature: varchar('requester_signature', { length: 255 }),
  approver_signature: varchar('approver_signature', { length: 255 }),
});

export const announcements = pgTable('announcements', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  author_id: uuid('author_id').references(() => users.id),
  valid_from: date('valid_from'),
  valid_to: date('valid_to'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const announcement_targets = pgTable('announcement_targets', {
  id: uuid('id').defaultRandom().primaryKey(),
  announcement_id: uuid('announcement_id').references(() => announcements.id).notNull(),
  target_type: varchar('target_type', { length: 50 }).notNull(), // all, team, project, user
  target_id: uuid('target_id'), // Optional, depending on target_type
});

export const polls = pgTable('polls', {
  id: uuid('id').defaultRandom().primaryKey(),
  question: text('question').notNull(),
  is_anonymous: boolean('is_anonymous').default(false).notNull(),
  allow_multiple: boolean('allow_multiple').default(false).notNull(),
  results_visibility: varchar('results_visibility', { length: 50 }).default('public').notNull(), // public, restricted
  deadline: timestamp('deadline'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  author_id: uuid('author_id').references(() => users.id),
});

export const poll_options = pgTable('poll_options', {
  id: uuid('id').defaultRandom().primaryKey(),
  poll_id: uuid('poll_id').references(() => polls.id).notNull(),
  option_text: varchar('option_text', { length: 255 }).notNull(),
});

export const poll_votes = pgTable('poll_votes', {
  id: uuid('id').defaultRandom().primaryKey(),
  poll_option_id: uuid('poll_option_id').references(() => poll_options.id).notNull(),
  user_id: uuid('user_id').references(() => users.id), // Optional if anonymous
  created_at: timestamp('created_at').defaultNow().notNull(),
});
