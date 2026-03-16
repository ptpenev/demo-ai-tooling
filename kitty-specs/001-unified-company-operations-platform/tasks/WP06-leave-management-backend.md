---
work_package_id: WP06
title: Leave Management Backend
lane: "doing"
dependencies: []
base_branch: master
base_commit: 092931735f861f954b2b1b646c4ea703608e3d4d
created_at: '2026-03-16T11:30:31.773979+00:00'
subtasks: [T021, T022, T025]
shell_pid: "11924"
agent: "gemini-3-flash-preview-reviewer"
---

# WP06: Leave Management Backend

## Objective
Implement leave request logic and automated balance tracking.

## Guidance

### T021: Leave Models & Migrations
- Create `LeaveType` and `LeaveRequest` models in `app/Modules/Leaves/Models/`.
- `LeaveRequest` fields: `user_id`, `leave_type_id`, `start_date`, `end_date`, `status`, `total_days`.

### T022: Leave Request API
- Build `LeaveRequestController` with `store` and `myRequests` methods.
- Implement logic to prevent overlapping requests.
- Calculate `total_days` excluding weekends and official holidays.

### T025: Leave Balance Calculation
- Implement service to calculate remaining leave balances.
- Deduct approved days from the user's annual quota.
- Handle accrual logic if applicable (e.g., +2 days per month).

## Definition of Done
- [ ] Users can submit leave requests via API.
- [ ] System correctly calculates working days (excluding holidays).
- [ ] Balance updates automatically upon request approval.

## Activity Log

- 2026-03-16T11:30:32Z – opencode – shell_pid=10076 – lane=doing – Assigned agent via workflow command
- 2026-03-16T11:32:16Z – opencode – shell_pid=10076 – lane=for_review – Leave Management backend foundation implemented. Includes models for LeaveType, LeaveRequest, and UserLeaveBalance. API for submitting requests and checking balances is ready. Business logic for business day calculation and balance deduction is implemented in a dedicated service.
- 2026-03-16T11:32:48Z – gemini-3-flash-preview-reviewer – shell_pid=11924 – lane=doing – Started review via workflow command
