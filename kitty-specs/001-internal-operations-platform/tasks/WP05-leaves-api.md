---
work_package_id: WP05
title: Leaves Backend
lane: "doing"
dependencies: []
base_branch: second-demo-nestjs
base_commit: 4429350ad4df040fb64bdde3e5596c8c9787cdc5
created_at: '2026-03-24T08:28:17.189096+00:00'
subtasks: [T014, T015, T016]
shell_pid: "21140"
---

# WP05: Leaves Backend

## Objective
Implement the schema and APIs for Leave Management (requests, approvals, and balances).

## Context
Leave management requires calculating remaining balances based on approved requests against a user's total allowed leave.

## Implementation Guidance

### T014: Create Leaves Schema
1. Define the `leave_types` table: `id`, `name`, `is_mandatory`.
2. Define the `leave_requests` table: `id`, `user_id`, `leave_type_id`, `start_date`, `end_date`, `days` (numeric), `status` (pending, approved, rejected), `approver_id`.
3. Add to `schema.ts`.

### T015: Implement Leave Requests API
1. Implement `POST /api/v1/leaves`: Submit a leave request.
2. Implement `GET /api/v1/leaves`: List leave requests. Includes logic to calculate and return the user's available leave balance (e.g., 20 days minus sum of approved paid leave days).
3. Implement `PATCH /api/v1/leaves/:id/status`: Approve or reject a request. Requires specific manager/admin permissions. Update the `approver_id` field.

### T016: Write Unit/Integration Tests
1. Test leave request submission.
2. Test the calculation logic for leave balances.
3. Test that a standard user cannot approve their own leave.

## Validation & Definition of Done
- [ ] Leave schemas migrated.
- [ ] Users can request leave.
- [ ] Managers can approve or reject leave.
- [ ] The `GET` endpoint correctly calculates remaining leave balances.

## Reviewer Notes
Ensure that overlapping leave dates for the same user are either rejected or handled gracefully in the validation logic.
