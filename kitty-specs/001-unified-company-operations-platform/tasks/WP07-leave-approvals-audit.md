---
work_package_id: WP07
title: Leave Approvals & Audit
lane: planned
dependencies: []
subtasks: [T023, T024, T039]
---

# WP07: Leave Approvals & Audit

## Objective
Implement the approval workflow for leave requests and the central audit logging system.

## Guidance

### T023: Leave Approval Flow
- Build `approve` and `reject` endpoints.
- Ensure only users with `leave.approve` permission and correct scope can perform these actions.
- Each approval must trigger a snapshot in the audit log.

### T024: Leave Management UI
- Build a user dashboard for leave tracking.
- Create a Manager interface for reviewing and deciding on pending requests.

### T039: Central AuditLog System
- Create `AuditLog` model in `app/Modules/Audit/Models/`.
- Fields: `user_id`, `action`, `resource_type`, `resource_id`, `metadata` (JSON snapshot).
- Implement an global `Auditor` service to log key state transitions across the platform.

## Definition of Done
- [ ] Managers can approve/reject leave requests with comments.
- [ ] Every approval/rejection creates a detailed record in the `audit_logs` table.
- [ ] Audit logs capture a "before" and "after" snapshot of the request state.
