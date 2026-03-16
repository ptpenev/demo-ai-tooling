---
work_package_id: WP06
title: Leave Management Backend
lane: planned
dependencies: []
subtasks: [T021, T022, T025]
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
