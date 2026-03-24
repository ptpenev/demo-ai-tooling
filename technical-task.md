1. System Purpose
The purpose of this technical specification is the development of an internal web-based platform designed for:
- tracking working time (reporting / timesheets);
- leave management;
- providing visibility into project workload;
- facilitating internal communication and conducting polls.

The system will be used by all employees in the company. Access to system functionalities will be managed through roles and detailed access permissions.

2. User Roles and Access Rights
2.1 User Roles
The system must support the following roles, with the ability to add new ones in the future:
- Super Admin
- Admin
- Project Manager
- Technical Manager
- Team Lead
- Developer
- QA
- Designer
- Business Analyst
- DevOps
- Support
- HR
- Finance

Note: The Super Admin and Admin must have the ability to create and remove roles.

2.2 Access Rights
Access control must be managed by modules and functionalities, not only by roles. The same role may have different permissions in different projects.
Examples of permissions include:
- viewing reports;
- editing reports;
- approving reported working time;
- viewing leave requests;
- editing and approving leave requests;
- access to all projects or only specific projects.

3. Projects and Time Reporting
3.1 Project Management
The system must allow:
- creation, editing, and archiving of projects;
- assigning: Project Manager, Team Lead, project participants;
- marking projects as active or inactive.

3.2 Time Reporting Types
When reporting time, the user must be able to select the type of time:
- working time;
- overtime / outside working hours;
- day off;
- additional agreement with client.

Additional requirements:
- ability to add a comment to each time report;
- reporting by hours;
- ability to edit and correct reports depending on access rights.
The user who created the report must be able to edit their own report.

4. Timesheet and Calendar (Reports and Leaves)
The system must be able to calculate the total annual leave available to a user and the remaining leave after each approved request.

4.1 Calendar View
The system must provide a calendar view with the following modes: year, month, week, day.
The calendar must visualize:
- reported working time;
- whether the employee was absent on a given day, and if so, which action was selected;
- official holidays and non-working days.

4.2 Leave Types
Supported leave types include:
- paid annual leave – mandatory;
- additional paid annual leave provided by the employer;
- birthday bonus leave (for the month in which the employee was born);
- unpaid leave;
- sick leave;
- maternity / paternity leave;
- others (custom types).

All leave requests must contain fields for signatures from both the requester and the approver.

4.3 Access to Calendars
Depending on role and permissions, users may have access to: personal calendar, team calendar, project calendar, or all calendars in the system.
Access levels: view only, view and edit, approval.

5. Report Export
The system must allow exporting reports with the following options: selection of employee, selection of project, selection of period via calendar interface.
Export formats: CSV, PDF
The export must include: dates, project, reporting employee(s), worked hours, time type, comments.

6. Employee Profiles
Each user has an individual profile.
6.1 Basic Information: first name and last name, position, role(s), projects they work on, location, contact information.
6.2 Additional Information: technologies and skills, hobbies and interests, short description / bio, start date, availability type (on-site / remote).
Some information may be visible or editable depending on access permissions.

7. Access Rights and Permission Management
The system must support Permission-Based Access Control (PBAC) combined with Role-Based Access Control (RBAC).

7.1 Core Concepts
A Permission represents an atomic right to perform a specific action on a specific resource.
Fields: id, code, name, description, module, resource, action, scope, is_project_specific, is_active.
Scopes: own, team, project, all.

7.2 Roles
Roles represent groups of permissions that can be used as templates.

8. Announcements
Section for internal announcements.
Publishing to: all employees, selected teams, selected projects, selected users.
Features: title, content, validity period, history, visibility control.
Automated: Company-wide message when an employee has a birthday.

9. Polls
Functionality for creating and managing polls.
Features: question, possible answers (single/multiple choice), anonymous voting, public/restricted results, voting deadline.

10. Non-Functional Requirements
- web-based system;
- responsive design (desktop, tablet, mobile);
- role-based access control (RBAC);
- permission-based access control (PBAC);
- audit logs for key actions;
- good performance with at least 200 concurrent users;
- support for English / Bulgarian (if possible).

11. Expected Outcome
Centralized platform for reporting and leave management, clear project workload visibility, improved communication.

---

TECHNICAL STACK AND ARCHITECTURE

1. System Architecture (NestJS + React Monorepo)
The project is structured as a Monorepo. All backend services and frontend applications live in the same repository but in clearly separated directories.

IMPORTANT RULES FOR THE AI AGENT:
- Dependencies: ALL required dependencies are managed via `package.json`. You must inspect and use the existing packages specified in `package.json` for both frontend and backend. You do not need to guess what to use. If a strongly required package for a requested feature is missing, you are allowed to install it, but prefer using the existing stack.
- Separation of Concerns: Do NOT mix backend and frontend code. All backend code goes into the `apps/api` folder. All frontend code goes into the `apps/web` folder.
- Frontend Stack: The frontend strictly uses React. Do NOT create backend-rendered template files (e.g., EJS, Pug, Handlebars). The backend must only serve a REST or GraphQL API.
- Database: You MUST use Drizzle ORM for all database interactions. Do not write raw SQL queries unless explicitly requested or absolutely unavoidable for complex analytical queries.
- UI Components: You MUST use `shadcn/ui` and TailwindCSS for frontend components.
- API Documentation: Any changes made to the backend routes, as well as any new implementations, MUST be documented in a separate markdown file named `endpoints.md`. For each endpoint, you must clearly describe the HTTP method, the endpoint URL, example request parameters/body, and an example response to ensure the API structure is visible to everyone.

Stack Summary:
- Backend (`apps/api`): NestJS, TypeScript, Node.js, PostgreSQL, Redis, Drizzle ORM.
- Frontend (`apps/web`): React 18, TypeScript, Vite, React Query, Zustand (state), TailwindCSS, shadcn/ui, FullCalendar, React Hook Form, Zod.
- Infrastructure: Docker, Monorepo workspace (npm/pnpm/yarn).

2. Monorepo Project Structure
```
/
├── package.json          (Root workspace configuration)
├── apps/
│   ├── api/              (NestJS Backend)
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── db/                 (Drizzle ORM schema and migrations)
│   │   │   │   ├── schema.ts
│   │   │   │   └── migrations/
│   │   │   └── modules/            (Domain Modules)
│   │   │       ├── users/
│   │   │       ├── auth/
│   │   │       ├── projects/
│   │   │       ├── timesheets/
│   │   │       ├── leaves/
│   │   │       ├── calendar/
│   │   │       ├── reports/
│   │   │       ├── announcements/
│   │   │       ├── polls/
│   │   │       ├── rbac/
│   │   │       └── audit/
│   │   └── ...
│   │
│   └── web/              (React Frontend)
│       ├── package.json
│       ├── src/
│       │   ├── api/                (React Query hooks & axios/fetch clients)
│       │   ├── components/         (shadcn/ui and shared components)
│       │   ├── features/           (Domain-specific frontend logic)
│       │   ├── hooks/
│       │   ├── pages/
│       │   ├── store/              (Zustand stores)
│       │   ├── utils/
│       │   └── App.tsx
│       └── ...
```

3. NestJS Module Structure
Each module in `apps/api/src/modules/ModuleName/` should contain:
- `module-name.module.ts`
- `module-name.controller.ts` (REST API Endpoints)
- `module-name.service.ts` (Business Logic)
- `module-name.repository.ts` (Data Access Layer via Drizzle)
- `dto/` (Data Transfer Objects with class-validator/zod)
- `entities/` or directly using the central `db/schema.ts` for Drizzle schemas.

Architectural Principles:
- Controllers must remain thin. They accept requests, call services, and return responses. No business logic should reside in the controller.
- Use the Service Layer pattern for all business logic.
- Use the Repository pattern for all data access (abstracting Drizzle ORM calls).
- Use DTOs with class-validator for input validation and class-transformer for response serialization.
- Never return raw entities or internal errors in production responses. All API responses should follow a consistent format: `{ "data": {}, "meta": {}, "errors": [] }`.
- API endpoints must be versioned (e.g., `/api/v1/...`).

Database & Architecture Best Practices:
- Always generate migrations via `drizzle-kit generate` and never modify tables manually.
- Use Passport.js with JWT strategy for authentication, alongside `@nestjs/throttler` for rate-limiting.
- Ensure all input is validated using NestJS `ValidationPipe`.
- Optimize queries by selecting only necessary columns, using pagination for list endpoints, and eager loading relations instead of creating N+1 queries.
- Incorporate testing: write unit tests for services (using mock repositories) and integration tests for endpoints. Target 80% coverage for business logic.

4. Database Schema (Drizzle ORM)
All database definitions must be done using Drizzle ORM in `apps/api/src/db/schema.ts` (or split into multiple files under `apps/api/src/db/schema/`).

Example Drizzle Schema mapping:
- `users`: id, first_name, last_name, email, password, position, location, phone, bio, start_date, availability_type.
- `roles`, `permissions`, `role_permissions`, `user_roles`.
- `projects`, `project_members`.
- `timesheet_entries`: id, user_id, project_id, date, hours, time_type, comment.
- `leave_requests`: id, user_id, leave_type_id, start_date, end_date, days, status.
- `announcements`, `announcement_targets`.
- `polls`, `poll_options`, `poll_votes`.
- `audit_logs`.

5. Frontend UI (shadcn/ui & React)
- The frontend must be a React Single Page Application (SPA).
- All UI elements (buttons, forms, modals, tables, dropdowns) must be built using `shadcn/ui` components and TailwindCSS.
- Forms should be handled via React Hook Form and validated with Zod.
- Data fetching and caching must be done via React Query, connecting to the NestJS API.

6. API Structure (NestJS Controllers)
Example REST endpoints:
- `GET /api/timesheets`
- `POST /api/timesheets`
- `PATCH /api/timesheets/:id`
- `DELETE /api/timesheets/:id`

Note: All newly implemented or modified endpoints must be fully documented in an `endpoints.md` file including the HTTP method, endpoint URL, example body/parameters, and example responses.

7. AI Agent Prompt Pipeline
Below are optimized instructions for the coding AI when working on this project. 

Prompt 1 — Project Context & Rules
"You are working in a Monorepo containing a NestJS backend (`apps/api`) and a React frontend (`apps/web`). All dependencies are defined in the `package.json` files; use them. Do not create backend templates. Use Drizzle ORM for database operations in the API. Use shadcn/ui and Tailwind for the React frontend."

Prompt 2 — Permission System
"Implement RBAC + PBAC using NestJS Guards and Drizzle ORM. Permissions must include module, resource, action, and scope (own, team, project, all). Create decorators to enforce permissions on controllers."

Prompt 3 — Timesheet Module
"Create the Timesheet module in NestJS and the corresponding React pages. Use Drizzle ORM to create the `timesheet_entries` schema. Implement NestJS controllers and services. In React, use shadcn/ui forms to submit hours, project, time type, and comments."

Prompt 4 — Leave Management
"Create the Leave Management module. Implement NestJS endpoints to submit and approve/reject leave requests. Ensure Drizzle schemas track signatures and status. In React, build the UI for users to request leave and managers to approve them."

Prompt 5 — Calendar
"Implement the Calendar feature. On the frontend, use FullCalendar React to display timesheets, leave requests, and holidays. On the backend, create an aggregation endpoint in NestJS that fetches this data using Drizzle ORM."

Prompt 6 — Announcements & Polls
"Implement Announcements and Polls modules. For announcements, include a NestJS CRON job (@Cron) to automatically post birthday announcements. For polls, create Drizzle schemas for options and votes, and build the shadcn/ui interfaces for voting."