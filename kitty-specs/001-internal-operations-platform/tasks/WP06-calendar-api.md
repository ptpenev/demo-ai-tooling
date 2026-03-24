---
work_package_id: WP06
title: Calendar Aggregation API
lane: "doing"
dependencies: []
base_branch: second-demo-nestjs
base_commit: 39f5071955c060a53d8ae455e326f360f07bedb1
created_at: '2026-03-24T08:47:16.279059+00:00'
subtasks: [T017, T018]
shell_pid: "18560"
agent: "opencode"
---

# WP06: Calendar Aggregation API

## Objective
Implement a backend API that aggregates timesheets, leave requests, and official holidays to feed a visual frontend calendar.

## Context
Team Leads and users need a visual overview of team members' presence and absence.

## Implementation Guidance

### T017: Implement Calendar API
1. Create `GET /api/v1/calendar`.
2. Accept query parameters for date ranges (`start_date`, `end_date`) and scope (e.g., `user_id`, `project_id`, or `team`).
3. Query `timesheet_entries` for logged hours in that date range.
4. Query `leave_requests` (approved) overlapping that date range.
5. Combine the data into a single array mapping dates to events (e.g., `{ date: "2026-03-24", type: "timesheet", hours: 8, project: "Project A" }`).
6. Apply PBAC filters so users only see calendars they are authorized to view.

### T018: Write Calendar Aggregation Tests
1. Test fetching a combined calendar for a user.
2. Ensure that unapproved leave requests are either filtered out or flagged as "pending" depending on the design decision.

## Validation & Definition of Done
- [ ] `GET /api/v1/calendar` successfully merges timesheets and leaves.
- [ ] Only authorized data is returned based on the user's role and scope.

## Reviewer Notes
Ensure that the SQL queries for this endpoint are optimized, as it will be fetching two different types of records for potentially large date ranges.

## Activity Log

- 2026-03-24T08:47:17Z – opencode – shell_pid=21492 – lane=doing – Assigned agent via workflow command
- 2026-03-24T08:58:20Z – opencode – shell_pid=21492 – lane=for_review – Ready for review
- 2026-03-24T08:59:11Z – opencode – shell_pid=18560 – lane=doing – Started review via workflow command
