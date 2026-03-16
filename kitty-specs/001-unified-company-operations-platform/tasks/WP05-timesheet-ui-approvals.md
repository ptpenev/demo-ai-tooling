---
work_package_id: WP05
title: Timesheet UI & Approvals
lane: planned
dependencies: []
subtasks: [T019, T020]
---

# WP05: Timesheet UI & Approvals

## Objective
Build the user interface for time reporting and the manager interface for approvals and corrections.

## Guidance

### T019: Timesheet Reporting UI
- Create a weekly/daily view for users to log hours in `resources/js/pages/timesheets/Index.tsx`.
- Use Shadcn/ui `Calendar` and `Input` components.
- Implement real-time totals calculation.

### T020: Timesheet Approval & Correction API
- Add `approve` and `reject` status tracking to `TimesheetEntry` (if needed by business rules, or use simple edit/correction).
- Build a "Manager Review" page listing team entries.
- Allow Managers/Admins to edit any entry based on their `all` or `team` scope.

## Definition of Done
- [ ] Users can log and edit their time hours via a clean UI.
- [ ] Managers can view and correct entries for their team members.
- [ ] Responsive design works on mobile for quick reporting.
