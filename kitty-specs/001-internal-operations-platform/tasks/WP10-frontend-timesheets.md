---
work_package_id: WP10
title: Frontend Timesheets UI
lane: "done"
dependencies: []
base_branch: second-demo-nestjs
base_commit: 431b936ab9a50d69577d5d2e7992794d9ef77d8d
created_at: '2026-03-24T09:32:27.974476+00:00'
subtasks: [T028, T029]
shell_pid: "14708"
agent: "opencode"
reviewed_by: "ptpenev"
review_status: "approved"
---

# WP10: Frontend Timesheets UI

## Objective
Implement the user interfaces for logging and reviewing timesheets.

## Context
This is a high-traffic area. The forms must be fast, responsive, and easy to use.

## Implementation Guidance

### T028: Implement Timesheet Entry Form
1. Create a modal or dedicated page (`/timesheets/new`) using `React Hook Form`.
2. Fetch the list of available projects (`GET /api/v1/projects`) and populate a dropdown.
3. Include inputs for date, hours, time_type (dropdown), and comments.
4. Call `POST /api/v1/timesheets` on submit and update the React Query cache.

### T029: Implement Timesheet List/View
1. Create `/timesheets` to display a data table (`shadcn/ui` Table) of the user's logged hours.
2. Implement filters (Date range, Project).
3. Add edit/delete buttons for each row (disabled if the timesheet is approved).

## Validation & Definition of Done
- [ ] Users can successfully submit a timesheet entry.
- [ ] The timesheet list updates immediately after submission (React Query invalidation).
- [ ] Users cannot edit approved timesheet rows in the UI.

## Reviewer Notes
Ensure that the project dropdown is populated dynamically based on the projects the user is currently assigned to.

## Activity Log

- 2026-03-24T09:32:29Z – opencode – shell_pid=20224 – lane=doing – Assigned agent via workflow command
- 2026-03-24T09:39:52Z – opencode – shell_pid=20224 – lane=for_review – Ready for review: Implemented Timesheets UI with log, edit, and delete functionality along with project/date filters.
- 2026-03-24T09:40:33Z – opencode – shell_pid=14708 – lane=doing – Started review via workflow command
- 2026-03-24T09:41:30Z – opencode – shell_pid=14708 – lane=done – Review passed: Frontend Timesheets UI implemented efficiently using ShadCN components, React Query, and valid filters.
