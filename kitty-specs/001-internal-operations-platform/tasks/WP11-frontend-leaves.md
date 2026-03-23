---
work_package_id: WP11
title: Frontend Leaves UI
lane: planned
dependencies: []
subtasks: [T030, T031]
---

# WP11: Frontend Leaves UI

## Objective
Implement UI components for submitting leave requests and for managers to approve them.

## Context
Displays current leave balances to users so they know how much time they can request.

## Implementation Guidance

### T030: Implement Leave Request Form
1. Create a `/leaves/new` form.
2. Form fields: `leave_type_id` (dropdown), `start_date`, `end_date`, `days` (numeric calculation or manual entry).
3. Fetch user's remaining leave balance and display it near the form.
4. Prevent submission if requested days exceed balance (unless it's unpaid or sick leave).

### T031: Implement Leave Balances & Approvals View
1. Display the user's current leave balances prominently at the top of `/leaves`.
2. Display a list (`shadcn/ui` Data Table) of the user's leave requests with their current status.
3. If the logged-in user has approval permissions, add a section/tab for "Pending Approvals" showing requests from other users.
4. Implement "Approve" and "Reject" buttons that call `PATCH /api/v1/leaves/:id/status`.

## Validation & Definition of Done
- [ ] Users can submit new leave requests successfully.
- [ ] Remaining leave balances update immediately (cache invalidation) when a request is approved.
- [ ] Only users with "approve" permissions can see the "Pending Approvals" list.

## Reviewer Notes
Ensure that the frontend accurately reflects the "pending" state of leave requests and that managers can easily approve them with immediate UI feedback.