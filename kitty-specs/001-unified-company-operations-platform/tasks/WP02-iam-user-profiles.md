---
work_package_id: WP02
title: IAM & User Profiles
lane: "for_review"
dependencies: []
base_branch: master
base_commit: 09739d614c19706011443498ec408106e97eff60
created_at: '2026-03-16T11:09:48.958475+00:00'
subtasks: [T007, T008, T009, T010, T011]
shell_pid: "10592"
agent: "gemini-3-flash-preview"
---

# WP02: IAM & User Profiles

## Objective
Implement the User model, profile API, and the hybrid RBAC + PBAC permission system with scoping.

## Context
The platform requires a sophisticated permission model where access is determined by atomic permissions (e.g., `timesheet.view`) and scopes (e.g., `own`, `team`, `all`). This WP builds the core logic for this system.

## Guidance

### T007: User Model & Migration
- Create `User` model in `app/Modules/Users/Models/`.
- Add fields: `first_name`, `last_name`, `position`, `location`, `bio`, `start_date`, `availability_type`.
- Implement `availability_type` as an enum (onsite, remote, hybrid).

### T008: User Profile API
- Create `UserProfileController` with `show` and `update` methods.
- Implement `UserProfileResource` for JSON output.
- Add validation in `UpdateProfileRequest`.

### T009: RBAC + PBAC Scoping Logic
- Extend Spatie's `Permission` model to support the fields defined in `data-model.md`.
- Implement logic to check permissions against scopes. For example, if a user has `timesheet.view` with scope `own`, they can only see their own records.
- Create a `HasPermissions` trait to be used in the `User` model.

### T010: Admin UI for Permissions
- Create a React page in `resources/js/pages/admin/Permissions.tsx`.
- Build a grid/table to manage Roles and assign Permissions with Scopes.
- Use Shadcn/ui `Table` and `Dialog` components.

### T011: Permission Middleware
- Create `CheckPermission` middleware in `app/Http/Middleware/`.
- The middleware should accept a permission code (e.g., `auth:timesheet.view`) and check the user's rights.
- Ensure it handles the "Scope" logic correctly by attaching the scope to the request object for use in controllers.

## Definition of Done
- [ ] User profile can be updated via API and reflects in the database.
- [ ] Permissions can be assigned to roles with specific scopes via the Admin UI.
- [ ] API routes are protected by the `CheckPermission` middleware.
- [ ] A test user with `own` scope cannot access another user's profile.

## Activity Log

- 2026-03-16T11:09:50Z – gemini-3-flash-preview – shell_pid=10592 – lane=doing – Assigned agent via workflow command
- 2026-03-16T11:11:24Z – gemini-3-flash-preview – shell_pid=10592 – lane=for_review – IAM & User Profiles implementation complete. Includes hybrid RBAC+PBAC scoping logic, User profile API, scoping middleware, and Admin UI for permissions.
