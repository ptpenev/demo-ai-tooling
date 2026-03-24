# API Endpoints: Internal Operations Platform

All endpoints are versioned (e.g., `/api/v1/`) and return the standardized JSON format:
```json
{
  "data": {},
  "meta": {},
  "errors": []
}
```

## Authentication & Profiles
- `POST /api/v1/auth/login` - Authenticate and return JWT token
- `GET /api/v1/users/me` - Get current user profile and active permissions
- `PATCH /api/v1/users/me` - Update own profile data

## RBAC & Permissions (Super Admin / Admin)
- `GET /api/v1/roles` - List all roles
- `POST /api/v1/roles` - Create new role with permissions
- `PATCH /api/v1/roles/:id` - Edit role permissions
- `POST /api/v1/users/:id/roles` - Assign roles (globally or scoped to project)

## Timesheets
- `GET /api/v1/timesheets` - Get timesheets (supports pagination, filtering by date/project)
- `POST /api/v1/timesheets` - Log hours against a project
- `PATCH /api/v1/timesheets/:id` - Edit a timesheet entry (only if unapproved/unlocked)
- `DELETE /api/v1/timesheets/:id` - Remove a timesheet entry

## Leave Management
- `GET /api/v1/leaves` - Get leave requests and current balance
- `POST /api/v1/leaves` - Submit a new leave request
- `PATCH /api/v1/leaves/:id/status` - Approve or reject a leave request (Manager)

## Projects & Calendars
- `GET /api/v1/projects` - List available projects based on user permissions
- `GET /api/v1/calendar` - Aggregate timesheets, leaves, and holidays based on requested scope (own, team, project, all)

## Announcements & Polls
- `GET /api/v1/announcements` - Fetch visible announcements for the current user
- `POST /api/v1/announcements` - Publish an announcement (HR/Admin)
- `GET /api/v1/polls` - Fetch active polls
- `POST /api/v1/polls/:id/vote` - Submit a vote (anonymous or identified)