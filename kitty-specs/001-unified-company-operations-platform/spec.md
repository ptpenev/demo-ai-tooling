# Specification: Unified Company Operations Platform

## Purpose
The Unified Company Operations Platform is a centralized internal web application designed to replace and consolidate multiple disconnected tools into a single source of truth. It streamlines company operations by integrating time reporting, leave management, project tracking, and internal communications into one cohesive system with a sophisticated, unified permission model.

## User Scenarios
- **Developer Reporting Time**: A developer logs into the dashboard, selects an active project they are assigned to, and records 8 hours of "Working Time" with a brief comment about their tasks for the day.
- **Manager Approving Leave**: An HR manager receives a notification for a new "Paid Annual Leave" request. They view the employee's remaining balance, check the team calendar for conflicts, and approve the request with a digital signature.
- **Admin Managing Permissions**: An administrator creates a new custom role for "Junior Project Manager" and assigns specific "view" and "edit" permissions limited to only the projects that user is participating in.
- **All-Hands Announcement**: A Super Admin posts a company-wide announcement about an upcoming holiday. The system automatically schedules it to appear on everyone's dashboard for the next 5 days.
- **Birthday Celebrations**: The system automatically detects an employee's birthday and generates a celebratory announcement visible to the entire company on that day.

## Functional Requirements

### 1. Identity & Access Management (IAM)
- **Role-Based & Permission-Based Control**: Support a hybrid model (RBAC + PBAC) where roles serve as templates but final access is determined by atomic permissions (e.g., `timesheet.view`, `leave.approve`).
- **Dynamic Scoping**: Permissions must support scoping (Own, Team, Project, All) to restrict data access based on the user's relationship to the resource.
- **Role Administration**: Super Admins and Admins must be able to create, edit, and delete roles and manage their associated permissions.

### 2. Project & Time Management
- **Project Lifecycle**: Allow creation, editing, archiving, and participant assignment (Project Manager, Team Lead, Participants) for projects.
- **Granular Time Reporting**: Users can report hours against specific projects with categories (Working, Overtime, Holiday, Client Extra) and mandatory comments.
- **Timesheet Corrections**: Support editing of reports by the creator or authorized managers based on access rights.

### 3. Leave Management
- **Automated Balance Tracking**: Calculate total annual leave, accruals, and remaining balances automatically after approved requests.
- **Diverse Leave Types**: Support Paid Annual, Sick Leave, Maternity/Paternity, Birthday Bonus, and custom user-defined types.
- **Approval Workflow**: Implement a formal request-and-approval flow requiring "signatures" (audit log entries) from both requester and approver.

### 4. Calendar & Visibility
- **Unified Calendar Interface**: Visualize reported time, absences, and official holidays in Day/Week/Month/Year views.
- **Access Scopes**: Provide Personal, Team, Project, and Global calendar views depending on user permissions.

### 5. Reporting & Exports
- **Filtered Exports**: Allow exporting timesheet and leave data filtered by employee, project, and date range.
- **Standard Formats**: Support CSV and PDF export formats for all reports.

### 6. Internal Communication & Engagement
- **Targeted Announcements**: Publish messages to specific audiences (All, Team, Project, User) with defined validity periods.
- **Birthday Automation**: Automatically generate and publish birthday greetings for employees.
- **Internal Polls**: Create single/multiple-choice polls with options for anonymity, real-time results, and deadlines.

## Key Entities
- **User**: Employee profile with basic info, skills, roles, and leave balances.
- **Role/Permission**: Access control templates and atomic rights.
- **Project**: Work container with assigned managers and members.
- **Timesheet Entry**: Record of work duration, type, and project association.
- **Leave Request**: Application for time off with status tracking and signatures.
- **Announcement/Poll**: Internal communication and engagement objects.

## Success Criteria
- **Consolidation**: All functionality previously handled by 3+ separate tools is accessible through one single login.
- **Permission Precision**: 100% of tested access attempts for "Team-only" or "Project-only" data correctly respect the assigned scope.
- **Operational Efficiency**: Managers report a reduction in time spent manually calculating leave balances or chasing timesheets.
- **System Stability**: Support at least 200 concurrent users with a dashboard load time of under 2 seconds.

## Assumptions
- The organization will use a standard Docker-based infrastructure for deployment.
- Initial leave balances and user profiles will be set up manually as part of the "fresh start" policy.
- All users have a company email for authentication.
