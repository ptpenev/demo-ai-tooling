---
work_package_id: WP03
title: Projects Backend
lane: "for_review"
dependencies: []
base_branch: second-demo-nestjs
base_commit: b3903a1f1c01b54491e85c23a18d1262f7b0fddc
created_at: '2026-03-24T07:49:57.101914+00:00'
subtasks: [T008, T009, T010]
shell_pid: "5216"
agent: "opencode"
---

# WP03: Projects Backend

## Objective
Implement the schemas and APIs for managing Projects and assigning Team Members.

## Context
Projects act as the central anchor for timesheets and some scoped permissions. 

## Implementation Guidance

### T008: Create Projects Schema
1. Define the `projects` table: `id`, `name`, `description`, `status` (active, inactive, archived), `start_date`, `end_date`.
2. Define the `project_members` table: `project_id`, `user_id`, `project_role` (manager, lead, member).
3. Add these to `schema.ts`.

### T009: Implement Projects API
1. Implement `GET /api/v1/projects` to list accessible projects for the authenticated user. If the user is an Admin, they see all projects. If a standard user, they only see projects they are members of.
2. Implement `POST /api/v1/projects` to create a new project.
3. Implement `PATCH /api/v1/projects/:id` to update status/details.
4. Implement `POST /api/v1/projects/:id/members` to assign users to the project.

### T010: Write Unit/Integration Tests
1. Write Jest tests covering the filtering logic of `GET /api/v1/projects`.
2. Test the creation and modification of projects.

## Validation & Definition of Done
- [ ] The `projects` and `project_members` tables are migrated.
- [ ] Users can only view projects they are authorized to see.
- [ ] Project Managers can be assigned to projects.
- [ ] Tests verify that users cannot view projects they are not members of (unless they have global scope).

## Reviewer Notes
Ensure that the SQL queries fetching projects use Drizzle's join capabilities efficiently and avoid N+1 issues when fetching member lists.

## Activity Log

- 2026-03-24T07:49:58Z – opencode – shell_pid=5216 – lane=doing – Assigned agent via workflow command
- 2026-03-24T08:03:37Z – opencode – shell_pid=5216 – lane=for_review – Ready for review
