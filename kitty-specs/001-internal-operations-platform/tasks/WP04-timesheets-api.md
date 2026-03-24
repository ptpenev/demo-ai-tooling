---
work_package_id: WP04
title: Timesheets Backend
lane: "for_review"
dependencies: []
base_branch: second-demo-nestjs
base_commit: 15618551d1115e6b72e91ee47bde286ff101f759
created_at: '2026-03-24T08:10:43.817940+00:00'
subtasks: [T011, T012, T013]
shell_pid: "5880"
agent: "opencode"
---

# WP04: Timesheets Backend

## Objective
Implement the backend timesheet logging module, allowing users to report working hours, overtime, and days off against projects.

## Context
This is a high-priority operational requirement. Users must be able to log hours, and these hours must be tied to a project.

## Implementation Guidance

### T011: Create Timesheets Schema
1. Define the `timesheet_entries` table: `id`, `user_id`, `project_id`, `date`, `hours`, `time_type` (working_time, overtime, day_off, client_agreement), `comment`, `is_approved`.
2. Add to `schema.ts`.

### T012: Implement Timesheets API
1. Implement `POST /api/v1/timesheets`: Create an entry. Validate that the user is a member of the project.
2. Implement `GET /api/v1/timesheets`: List entries with support for pagination and filtering (by date range, project, user). Enforce PBAC (users can see their own, Team Leads can see their project's, Admins can see all).
3. Implement `PATCH /api/v1/timesheets/:id`: Edit an entry. Allow edits only if `is_approved` is false.
4. Implement `DELETE /api/v1/timesheets/:id`: Delete an entry (only if unapproved).

### T013: Write Unit/Integration Tests
1. Test creation and validation of a timesheet entry.
2. Test that editing an approved timesheet returns an error.
3. Test PBAC constraints on `GET` (ensuring users only see their own timesheets unless authorized otherwise).

## Validation & Definition of Done
- [ ] Timesheet schema migrated.
- [ ] API successfully creates, reads, updates, and deletes timesheet entries.
- [ ] Users cannot edit approved timesheets.
- [ ] Tests verify that users can only log time against projects they are members of.

## Reviewer Notes
Check the validation logic for `hours` (e.g., must be a positive number, perhaps max 24 per day). Ensure DTOs are strictly enforcing these rules.

## Activity Log

- 2026-03-24T08:10:45Z – opencode – shell_pid=5880 – lane=doing – Assigned agent via workflow command
- 2026-03-24T08:25:27Z – opencode – shell_pid=5880 – lane=for_review – Ready for review
