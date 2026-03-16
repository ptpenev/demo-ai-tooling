TECHNICAL SPECIFICATION
Reporting, Timesheet, and Leave Management
Platform

1. System Purpose
The purpose of this technical specification is the development of an internal web-
based platform designed for:
tracking working time (reporting / timesheets);
leave management;
providing visibility into project workload;
facilitating internal communication and conducting polls.
The system will be used by all employees in the company.
Access to system functionalities will be managed through roles and detailed access
permissions.

2. User Roles and Access Rights
2.1 User Roles
The system must support the following roles, with the ability to add new ones in the
future:
Super Admin
Admin
Project Manager
Technical Manager
Team Lead
Developer

QA
Designer
Business Analyst
DevOps
Support
HR
Finance
Note:
The Super Admin and Admin must have the ability to create and remove roles.

2.2 Access Rights
Access control must be managed by modules and functionalities, not only by roles.
The same role may have different permissions in different projects.
Examples of permissions include:
viewing reports;
editing reports;
approving reported working time;
viewing leave requests;
editing and approving leave requests;
access to all projects or only specific projects.

3. Projects and Time Reporting
3.1 Project Management
The system must allow:
• creation, editing, and archiving of projects;

• assigning:
◦ Project Manager;
◦ Team Lead;
◦ project participants;
• marking projects as active or inactive.

3.2 Time Reporting Types
When reporting time, the user must be able to select the type of time:
working time;
overtime / outside working hours;
day off;
additional agreement with client.
Additional requirements:
ability to add a comment to each time report;
reporting by hours;
ability to edit and correct reports depending on access rights.
The user who created the report must be able to edit their own report.

4. Timesheet and Calendar (Reports and
Leaves)
The system must be able to calculate the total annual leave available to a user and
the remaining leave after each approved request.

4.1 Calendar View
The system must provide a calendar view with the following modes:

year
month
week
day
The calendar must visualize:
reported working time;
whether the employee was absent on a given day, and if so, which action was selected
(paid/unpaid leave, sick leave, paternity leave, etc.);
official holidays and non-working days.

4.2 Leave Types
Supported leave types include:
paid annual leave – mandatory;
additional paid annual leave provided by the employer;
birthday bonus leave (for the month in which the employee was born);
unpaid leave;
sick leave;
maternity / paternity leave;
others (custom types).
All leave requests must contain fields for signatures from both the requester and
the approver.

4.3 Access to Calendars
Depending on role and permissions, users may have access to:
personal calendar;
team calendar;

project calendar;
all calendars in the system.
Access levels:
view only;
view and edit;
approval.

5. Report Export
The system must allow exporting reports with the following options:
selection of employee;
selection of project;
selection of period via calendar interface;
Export formats:
CSV
PDF
The export must include:
dates;
project;
reporting employee(s);
worked hours;
time type (working time, overtime, day off, etc.);
comments.

6. Employee Profiles
Each user has an individual profile.

6.1 Basic Information
first name and last name;
position;
role(s);
projects they work on;
location;
contact information.

6.2 Additional Information
technologies and skills;
hobbies and interests;
short description / bio;
start date;
availability type (on-site / remote).
Some information may be visible or editable depending on access permissions.

7. Access Rights and Permission
Management
The system must support Permission-Based Access Control (PBAC) combined with
Role-Based Access Control (RBAC).
Roles serve as templates of permissions, but the final access level of a user is
determined by specific permissions, which can be:
global;
project-specific;
module-specific.

7.1 Core Concepts
A Permission represents an atomic right to perform a specific action on a specific
resource.
Fields:
• id – unique identifier;
• code – unique code (e.g. timesheet.view, leave.approve);
• name – human-readable name;
• description – description of the action;
• module – module to which the permission belongs (Timesheet, Projects, Leaves,
Reports, Users, Announcements, Polls, etc.);
• resource – the object the permission applies to (e.g. report, project, leave, user);
• action – action type:
◦ view;
◦ create;
◦ edit;
◦ delete;
◦ approve;
◦ export;
• scope – scope of the permission:
◦ own (only own records);
◦ team;
◦ project;
◦ all;
• is_project_specific – whether the permission can be assigned per project;

• is_active – whether the permission is active;
• created_at / updated_at – system metadata.

7.2 Roles
Roles represent groups of permissions that can be used as templates.
Requirements:
Super Admin and Admin must be able to:
create, edit, and delete roles;
add and remove permissions from roles.
Additional rules:
• Roles are not fixed and can be modified.
• A user may have one or multiple roles.
• A role may be:
◦ global;
◦ valid only for a specific project.
Some information may be visible or editable depending on access permissions.

8. Announcements
Section for internal announcements with the following functionality:
Publishing announcements to:
all employees;
selected teams;
selected projects;
selected users.
Announcements must support:

title;
content;
validity period (visible for a specific period or permanently);
history of published announcements;
visibility control according to roles and permissions.
The system must also automatically generate a company-wide message when an
employee has a birthday, displaying a celebratory message.

9. Polls
Functionality for creating and managing polls:
Creating a poll with:
question;
possible answers (single choice / multiple choice).
Polls can be sent to:
all employees;
selected users.
Options include:
anonymous voting;
public or restricted results;
real-time result viewing;
voting deadline.

10. Non-Functional Requirements
web-based system;
responsive design (desktop, tablet, mobile);

role-based access control (RBAC);
permission-based access control (PBAC);
audit logs for key actions;
good performance with at least 200 concurrent users;
support for English / Bulgarian (if possible).

11. Expected Outcome
centralized platform for reporting and leave management;
clear and up-to-date visibility of project workload;
improved internal communication;
significant reduction of manual administrative work.

Technical Stack
1. System Architecture (Laravel 12 +
React)
Stack
Backend
Laravel 12
PHP 8.3
PostgreSQL
Redis
Laravel Queue (Redis)

Laravel Sanctum (API auth)
Laravel Policies + Gates
Spatie Permission (RBAC base)
Laravel Events
Laravel Scheduler
Laravel Audit Log

Frontend
React 18
TypeScript
Vite
React Query
Zustand (state)
TailwindCSS
FullCalendar
React Hook Form
Zod validation

Infrastructure
Docker
NGINX
PostgreSQL
Redis
S3 (file exports)

2. Architecture Overview
React SPA
|
| REST API
|
Laravel API
|
├ Users Module
├ Roles & Permissions Module
├ Projects Module
├ Timesheets Module
├ Leave Management Module
├ Calendar Module
├ Reporting/Export Module
├ Announcements Module
├ Polls Module
├ Audit Logs
└ Notifications

3. Laravel Project Structure
AI agent should organize the Laravel project using Domain Modules.
app/

Modules/

Users/
Projects/
Timesheets/
Leaves/
Calendar/
Reports/
Announcements/
Polls/
Permissions/
Audit/
Notifications/

Each module should contain:
ModuleName/

Controllers/
Models/
Policies/

Services/
DTO/
Requests/
Resources/
Routes/
Database/

4. Database Schema (Laravel Migrations)
Users
users
-----
id
first_name
last_name
email
password
position
location
phone
bio
start_date
availability_type

created_at
updated_at

availability_type
onsite
remote
hybrid

Roles
Using Spatie Permission with extension.
roles
permissions
model_has_roles
role_has_permissions
model_has_permissions

Custom additions:
project_roles
user_project_roles

Permissions

Permission structure:
permissions

id
code
name
module
resource
action
scope
is_project_specific
is_active
created_at

Scope:
own
team
project
all

Examples:
timesheet.view
timesheet.edit
leave.approve

report.export

5. Projects Module
Table
projects

id
name
description
is_active
project_manager_id
team_lead_id
created_at
updated_at

Project Members
project_members

id
project_id

user_id
role
created_at

6. Timesheet Module
Timesheet Entries
timesheet_entries

id
user_id
project_id
date
hours
time_type
comment
created_by
updated_at

Time Types
WORKING
OVERTIME
HOLIDAY

CLIENT_EXTRA

Rules:
Users can edit their own entries
Managers/Admins can edit all entries

7. Leave Management
Leave Types
leave_types

id
name
is_paid
is_system

System types:
paid_annual
paid_additional
birthday_bonus
unpaid
sick_leave
maternity

paternity
custom

Leave Requests
leave_requests

id
user_id
leave_type_id
start_date
end_date
days
status
request_signature
approver_signature
created_at
updated_at

Status:
pending
approved
rejected
cancelled

8. Calendar System
Calendar aggregates:
timesheets
leave requests
holidays

Views:
year
month
week
day

Scopes:
personal
team
project
all

Access levels:
view
edit

approve

9. Reporting Module
Export filters:
employee
project
date_range

Export formats:
CSV
PDF

Fields:
date
project
employee
hours
time_type
comment

Use:
Laravel Excel

DomPDF

Exports should be queued jobs.

10. Announcements Module
Table
announcements

id
title
content
valid_from
valid_until
created_by
created_at

Targeting table:
announcement_targets

announcement_id
target_type
target_id

target_type:
all
team
project
user

Birthday Automation
Laravel Scheduler job:
Check users with birthday today
Create announcement

11. Polls Module
Poll
polls

id
question
is_anonymous
result_visibility
deadline

created_by
created_at

Poll Options
poll_options

id
poll_id
text

Votes
poll_votes

id
poll_id
option_id
user_id
created_at

Support:
single choice

multiple choice
anonymous
real-time results

12. Audit Logs
audit_logs

id
user_id
action
resource_type
resource_id
metadata
created_at

Examples:
timesheet.updated
leave.approved
role.updated
project.created
report.exported

13. API Structure
Laravel API routes:
/api

/auth
/users
/projects
/timesheets
/leaves
/calendar
/reports
/announcements
/polls
/permissions
/audit

Example:
GET /api/timesheets
POST /api/timesheets
PATCH /api/timesheets/{id}
DELETE /api/timesheets/{id}

14. React Frontend Architecture
src/

api/
components/
features/
hooks/
pages/
store/
utils/

Feature modules:
users
projects
timesheets
leaves
calendar
reports
announcements
polls

15. Core React Pages

Dashboard
Timesheet
Calendar
Leave Requests
Projects
Reports
Announcements
Polls
User Profile
Admin Panel

16. Calendar UI
Use:
FullCalendar React

Events:
timesheets
leave
holidays

17. State Management
React Query → server state
Zustand → auth + UI state

18. AI Agent Prompt Pipeline
Below are optimized prompts for the coding AI.

Prompt 1 — Project Bootstrap
Create a fullstack system using:

Backend:
Laravel 12
PHP 8.3
PostgreSQL
Redis
Laravel Sanctum

Frontend:
React
TypeScript
Vite

Tailwind

The system is an internal company platform for:

- timesheets
- leave management
- project management
- reporting
- announcements
- polls

Generate the full Laravel + React project structure.

Prompt 2 — Permission System
Implement RBAC + PBAC using Laravel.

Use Spatie Laravel Permission.

Permissions must include:

module
resource

action
scope

Scope values:

own
team
project
all

Users may have:

global roles
project roles
multiple roles

Create middleware to enforce permissions.

Prompt 3 — Timesheet Module
Create Timesheet module.

Features:

report hours
assign project
select time type
add comment

Time types:

WORKING
OVERTIME
HOLIDAY
CLIENT_EXTRA

Rules:

Users can edit their own entries.
Managers/Admins can edit any.

Create:

migrations
models
controllers
API endpoints

policies

Prompt 4 — Leave Management
Create Leave Management module.

Users can:

submit leave request

Managers can:

approve or reject leave.

Each request must store:

request signature
approver signature

System must track remaining annual leave.

Prompt 5 — Calendar
Create Calendar API.

Calendar must combine:

timesheets
leave requests
holidays

Views:

year
month
week
day

Prompt 6 — Reports
Create reporting module.

Exports:

CSV

PDF

Filters:

employee
project
date range

Exports must run as queued jobs.

Prompt 7 — Announcements
Create announcement system.

Announcements can target:

all users
teams
projects
specific users

Add scheduled job that automatically posts birthday announcements.

Prompt 8 — Polls
Create polling system.

Features:

single choice
multiple choice
anonymous voting
deadline
real-time results

19. Recommended Development Order
1. Auth
2. Users
3. Roles & Permissions
4. Projects
5. Timesheets
6. Leaves
7. Calendar
8. Reports
9. Announcements
10. Polls
11. Audit Logs