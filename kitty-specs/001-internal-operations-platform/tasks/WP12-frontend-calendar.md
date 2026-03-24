---
work_package_id: WP12
title: Frontend Calendar UI
lane: "done"
dependencies: []
base_branch: second-demo-nestjs
base_commit: a897f429a1743c591195ae447b5be4403739d247
created_at: '2026-03-24T09:49:59.420412+00:00'
subtasks: [T032, T033]
shell_pid: "21636"
agent: "opencode"
reviewed_by: "ptpenev"
review_status: "approved"
---

# WP12: Frontend Calendar UI

## Objective
Implement a visual calendar that aggregates both timesheets and leaves.

## Context
This view helps Team Leads and employees visualize presence and absence quickly.

## Implementation Guidance

### T032: Integrate FullCalendar
1. Install and integrate `FullCalendar` React components in `/calendar`.
2. Ensure the view supports month, week, and day views.
3. Use `shadcn/ui` components for calendar controls (e.g., date pickers, view switchers).

### T033: Connect Calendar to Aggregation API
1. Use React Query to fetch data from `GET /api/v1/calendar`.
2. Map the returned array of timesheets, leaves, and holidays into FullCalendar event objects.
   - Timesheets: Show total hours and project. Color code (e.g., blue).
   - Leaves: Show leave type and status. Color code (e.g., orange for pending, green for approved).
   - Holidays: Show official holidays. Color code (e.g., red).
3. Implement a filter panel allowing users to scope the calendar to themselves, their team, or a specific project.

## Validation & Definition of Done
- [ ] The calendar correctly displays events fetched from the API.
- [ ] Users can switch between different scopes (own, team, project).
- [ ] Color coding accurately reflects event types and statuses.

## Reviewer Notes
Verify that fetching data for a full month across an entire team does not cause performance issues on the frontend. Ensure that the React Query hook utilizes stale-time appropriately.

## Activity Log

- 2026-03-24T09:50:00Z – opencode – shell_pid=9796 – lane=doing – Assigned agent via workflow command
- 2026-03-24T09:57:28Z – opencode – shell_pid=9796 – lane=for_review – Ready for review
- 2026-03-24T09:58:30Z – opencode – shell_pid=21636 – lane=doing – Started review via workflow command
- 2026-03-24T09:59:40Z – opencode – shell_pid=21636 – lane=done – Review passed: Frontend Calendar UI properly integrated FullCalendar, maps events and holidays correctly, and applies PBAC scopes to filters.
