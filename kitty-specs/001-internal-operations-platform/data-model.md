# Data Model: Internal Operations Platform

This document outlines the primary entities and Drizzle ORM schema mappings for the backend.

## 1. Users and Profiles
*Table: `users`*
- `id`: UUID (Primary Key)
- `first_name`, `last_name`: varchar
- `email`: varchar (Unique)
- `password_hash`: varchar
- `position`, `location`, `phone`: varchar
- `bio`: text
- `start_date`: date
- `availability_type`: enum (on-site, remote, hybrid)
- `is_active`: boolean
- `created_at`, `updated_at`: timestamp

## 2. Roles and Permissions (RBAC + PBAC)
*Table: `permissions`*
- `id`: UUID (Primary Key)
- `code`, `name`, `description`: varchar
- `module`: enum (timesheet, leave, project, etc.)
- `resource`: varchar (e.g., 'timesheet_entry')
- `action`: enum (create, read, update, delete, approve)
- `scope`: enum (own, team, project, all)
- `is_project_specific`: boolean
- `is_active`: boolean

*Table: `roles`*
- `id`: UUID (Primary Key)
- `name`: varchar (Unique)
- `description`: text

*Table: `role_permissions`*
- `role_id`: UUID (Foreign Key)
- `permission_id`: UUID (Foreign Key)

*Table: `user_roles`*
- `user_id`: UUID (Foreign Key)
- `role_id`: UUID (Foreign Key)
- `project_id`: UUID (Optional Foreign Key, scoped role)

## 3. Projects and Teams
*Table: `projects`*
- `id`: UUID (Primary Key)
- `name`: varchar
- `description`: text
- `status`: enum (active, inactive, archived)
- `start_date`, `end_date`: date

*Table: `project_members`*
- `project_id`: UUID (Foreign Key)
- `user_id`: UUID (Foreign Key)
- `project_role`: enum (manager, lead, member)

## 4. Timesheets
*Table: `timesheet_entries`*
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key)
- `project_id`: UUID (Foreign Key)
- `date`: date
- `hours`: numeric(5,2)
- `time_type`: enum (working_time, overtime, day_off, client_agreement)
- `comment`: text
- `is_approved`: boolean

## 5. Leaves
*Table: `leave_types`*
- `id`: UUID (Primary Key)
- `name`: varchar (e.g., paid, sick, unpaid)
- `is_mandatory`: boolean

*Table: `leave_requests`*
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key)
- `leave_type_id`: UUID (Foreign Key)
- `start_date`, `end_date`: date
- `days`: numeric(5,2)
- `status`: enum (pending, approved, rejected)
- `approver_id`: UUID (Foreign Key - optional)
- `requester_signature`, `approver_signature`: varchar

## 6. Internal Communications
*Table: `announcements`*
- `id`: UUID (Primary Key)
- `title`, `content`: text
- `author_id`: UUID (Foreign Key)
- `valid_from`, `valid_to`: date

*Table: `announcement_targets`*
- `announcement_id`: UUID (Foreign Key)
- `target_type`: enum (all, team, project, user)
- `target_id`: UUID (Optional Foreign Key based on target_type)

*Table: `polls`*
- `id`: UUID (Primary Key)
- `question`: text
- `is_anonymous`: boolean
- `allow_multiple`: boolean
- `results_visibility`: enum (public, restricted)
- `deadline`: timestamp

*Table: `poll_options`*
- `id`: UUID (Primary Key)
- `poll_id`: UUID (Foreign Key)
- `option_text`: varchar

*Table: `poll_votes`*
- `id`: UUID (Primary Key)
- `poll_option_id`: UUID (Foreign Key)
- `user_id`: UUID (Foreign Key, optional if anonymous)

## 7. Audit
*Table: `audit_logs`*
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key)
- `action`: varchar
- `resource_type`, `resource_id`: varchar
- `details`: jsonb
- `created_at`: timestamp