---
work_package_id: WP01
title: Foundation Setup & Auth
lane: "doing"
dependencies: []
base_branch: second-demo-nestjs
base_commit: 36b008d35c07f2e4aa37e4b900d506b8a41cb1dc
created_at: '2026-03-23T15:20:25.356498+00:00'
subtasks: [T001, T002, T003, T004]
shell_pid: "14972"
agent: "opencode"
---

# WP01: Foundation Setup & Auth

## Objective
Set up the core Drizzle ORM database connection in NestJS, create the foundational schemas for authentication and RBAC, implement the PBAC/RBAC Guards & Decorators, and build the login and user profile APIs.

## Context
This is the foundational backend work package. The NestJS API must be secured using a JWT-based strategy, and every subsequent route will depend on the decorators you create here to enforce Permission-Based Access Control (PBAC).

## Implementation Guidance

### T001: Configure Drizzle ORM
1. Configure `apps/api/src/db/db.module.ts` to connect to PostgreSQL.
2. Ensure the connection uses environment variables (e.g., `DATABASE_URL`).
3. Set up the `drizzle-kit` configuration for generating migrations in `apps/api/drizzle.config.ts`.

### T002: Create Auth and RBAC Schemas
1. Create `apps/api/src/db/schema.ts` (or equivalent directory if splitting files).
2. Define the `users` table: `id`, `first_name`, `last_name`, `email`, `password_hash`, `is_active`, `created_at`.
3. Define the `roles` and `permissions` tables.
   - `permissions`: `id`, `code`, `module`, `resource`, `action`, `scope`, `is_active`.
4. Define the join tables: `role_permissions` and `user_roles`. `user_roles` should have an optional `project_id` for scoped roles.

### T003: Implement PBAC/RBAC Guards
1. Implement a JWT Strategy using `Passport.js`.
2. Create an `AuthGuard` to verify the JWT.
3. Create a custom `@RequirePermission(action, resource, scope)` decorator.
4. Implement a `PermissionsGuard` that reads the required permission, fetches the user's active permissions from the database via Drizzle, and checks if the user has access.

### T004: Implement Auth Login & Profile
1. Create `AuthController` (`POST /api/v1/auth/login`).
   - Validate input (email, password) using DTOs.
   - Compare password hash (use `bcrypt`).
   - Sign and return JWT token containing user ID.
2. Create `UsersController` (`GET /api/v1/users/me`).
   - Return current user's profile and their assigned active permissions.

## Validation & Definition of Done
- [ ] Drizzle ORM connects successfully to the database.
- [ ] Migrations can be generated via `drizzle-kit generate`.
- [ ] `POST /api/v1/auth/login` returns a valid JWT.
- [ ] `GET /api/v1/users/me` requires a valid JWT and returns the user's permissions.
- [ ] The `PermissionsGuard` blocks access if a user lacks the required permission.

## Reviewer Notes
Ensure DTOs are used for all inputs and that the `PermissionsGuard` correctly evaluates the `scope` logic if a user is acting within a specific project.

## Activity Log

- 2026-03-23T15:20:26Z – opencode – shell_pid=284 – lane=doing – Assigned agent via workflow command
- 2026-03-23T15:35:38Z – opencode – shell_pid=284 – lane=for_review – Ready for review
- 2026-03-23T15:39:36Z – opencode – shell_pid=14972 – lane=doing – Started review via workflow command
