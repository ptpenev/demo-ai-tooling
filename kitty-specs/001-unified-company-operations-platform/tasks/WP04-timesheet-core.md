---
work_package_id: WP04
title: Timesheet Core
lane: "done"
dependencies: []
base_branch: master
base_commit: 11c06c1098085a7f16b7ce56ebe2fea7ae425986
created_at: '2026-03-16T11:17:49.455639+00:00'
subtasks: [T016, T017, T018]
shell_pid: "11928"
agent: "gemini-3-flash-preview-reviewer"
reviewed_by: "ptpenev"
review_status: "approved"
---

# WP04: Timesheet Core

## Objective
Implement the backend foundation for time reporting, including data structures and validation.

## Guidance

### T016: TimesheetEntry Model & Migration
- Create `TimesheetEntry` model in `app/Modules/Timesheets/Models/`.
- Fields: `user_id`, `project_id`, `date`, `hours`, `time_type`, `comment`.
- Add foreign keys and indexes for performance.

### T017: Timesheet Reporting API
- Build `TimesheetController` with `index`, `store`, and `update` methods.
- Implement `TimesheetRequest` for validation.
- Ensure users can only report time for projects they are assigned to (if scope=project).

### T018: Time Type Validation
- Enforce `TimeType` enum (WORKING, OVERTIME, HOLIDAY, CLIENT_EXTRA).
- Make `comment` mandatory for all entries.
- Add business rules: maximum 24 hours per day, only reporting for active projects.

## Definition of Done
- [ ] Timesheet entries can be created via POST API with valid data.
- [ ] Validation errors are returned for missing comments or invalid time types.
- [ ] Users are blocked from reporting time for projects they don't belong to.

## Activity Log

- 2026-03-16T11:17:50Z – opencode – shell_pid=13304 – lane=doing – Assigned agent via workflow command
- 2026-03-16T11:20:25Z – opencode – shell_pid=13304 – lane=for_review – Timesheet Core implementation complete. Note: Dependency WP03 was manually merged into the worktree to access User and Project models, as it was missing from the WP prompt dependencies list.
- 2026-03-16T11:24:58Z – gemini-3-flash-preview-reviewer – shell_pid=11928 – lane=doing – Started review via workflow command
- 2026-03-16T11:25:40Z – gemini-3-flash-preview-reviewer – shell_pid=11928 – lane=done – Review passed: Implementation successfully establishes the backend core for Timesheets. The model, migration, and API endpoints are correctly implemented with proper validation and scoping logic. A missing projects relation in the User model was identified and fixed during review to ensure the scoping logic functions correctly.
