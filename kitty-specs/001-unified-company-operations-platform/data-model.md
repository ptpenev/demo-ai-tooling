# Data Model: Unified Company Operations Platform

## Core Primitives (Shared)
- **TimeType** (Enum): WORKING, OVERTIME, HOLIDAY, CLIENT_EXTRA
- **LeaveStatus** (Enum): PENDING, APPROVED, REJECTED, CANCELLED
- **TargetType** (Enum): ALL, TEAM, PROJECT, USER

## Domain Modules

### IAM (Identity & Access Management)
- **User**: id, first_name, last_name, email, position, location, bio, start_date, availability_type
- **Permission**: id, code, name, module, resource, action, scope, is_project_specific
- **Role**: id, name, is_project_specific

### Projects
- **Project**: id, name, description, is_active, project_manager_id, team_lead_id
- **ProjectMember**: project_id, user_id, role

### Timesheets
- **TimesheetEntry**: id, user_id, project_id, date, hours, time_type, comment

### Leave Management
- **LeaveType**: id, name, is_paid, is_system
- **LeaveRequest**: id, user_id, leave_type_id, start_date, end_date, status, total_days

### Communication
- **Announcement**: id, title, content, valid_from, valid_until, created_by
- **AnnouncementTarget**: announcement_id, target_type, target_id
- **Poll**: id, question, is_anonymous, result_visibility, deadline
- **PollOption**: poll_id, text
- **PollVote**: poll_id, option_id, user_id

### Audit
- **AuditLog**: id, user_id, action, resource_type, resource_id, metadata (snapshot), timestamp
