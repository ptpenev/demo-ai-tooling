---
work_package_id: WP05
title: Timesheet UI & Approvals
lane: "for_review"
dependencies: []
base_branch: master
base_commit: c6523dd3d93e7b98c3dd31b1989a54804fdfb3fa
created_at: '2026-03-16T11:26:54.182516+00:00'
subtasks: [T019, T020]
shell_pid: "10068"
agent: "opencode"
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

## Activity Log

- 2026-03-16T11:26:55Z – opencode – shell_pid=10068 – lane=doing – Assigned agent via workflow command
- 2026-03-16T11:28:43Z – opencode – shell_pid=10068 – lane=for_review – Implementation of Timesheet UI and Approvals complete. Includes user reporting view with week navigation, manager review dashboard with approve/reject actions, and updated backend API/Policies to support the approval workflow.
