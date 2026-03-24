---
work_package_id: WP02
title: Roles & Permissions API
lane: "done"
dependencies: []
base_branch: second-demo-nestjs
base_commit: b677089c0494a3222e1425adecebac5acb461e79
created_at: '2026-03-23T15:48:26.274484+00:00'
subtasks: [T005, T006, T007]
shell_pid: "20380"
agent: "opencode"
reviewed_by: "ptpenev"
review_status: "approved"
---

# WP02: Roles & Permissions API

## Objective
Implement the backend APIs allowing Super Admins to manage roles, assign permissions, and assign users to specific roles.

## Context
These APIs are critical for the administration of the platform. You must ensure that these routes are strictly protected using the Guards created in WP01.

## Implementation Guidance

### T005: Create Roles & Permissions CRUD API
1. Create a `RolesModule` with `RolesController` and `RolesService`.
2. Implement `GET /api/v1/roles` to list all roles.
3. Implement `POST /api/v1/roles` to create a new role with a specific array of permission IDs.
4. Implement `PATCH /api/v1/roles/:id` to update a role's permissions.
5. Protect these endpoints with `@RequirePermission('create', 'role', 'all')` (or similar).

### T006: Create Role Assignment API
1. Implement `POST /api/v1/users/:id/roles` in the `UsersController` or a dedicated assignment controller.
2. Payload must allow specifying a `role_id` and an optional `project_id` (for project-scoped roles).
3. Insert records into the `user_roles` table using Drizzle ORM.

### T007: Write Integration Tests
1. Write Jest integration tests for the `RolesController`.
2. Mock the database repository.
3. Verify that a user without the "admin" permission receives a `403 Forbidden` response.
4. Verify that assigning a role correctly updates the database.

## Validation & Definition of Done
- [ ] Roles can be created, updated, and retrieved via the API.
- [ ] Permissions are successfully joined when roles are returned.
- [ ] Users can be assigned a role globally or scoped to a project.
- [ ] Tests verify PBAC enforcement on these administrative routes.

## Reviewer Notes
Check that all endpoints strictly return the standardized `{ "data": {}, "meta": {}, "errors": [] }` format.

## Activity Log

- 2026-03-23T15:48:27Z – opencode – shell_pid=13400 – lane=doing – Assigned agent via workflow command
- 2026-03-23T16:06:51Z – opencode – shell_pid=13400 – lane=for_review – Ready for review
- 2026-03-24T07:40:30Z – opencode – shell_pid=20380 – lane=doing – Started review via workflow command
- 2026-03-24T07:43:52Z – opencode – shell_pid=20380 – lane=done – Review passed: LGTM. PBAC guards, role assignment, and Drizzle transactions are implemented perfectly.
