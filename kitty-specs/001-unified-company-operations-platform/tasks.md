# Work Packages: Unified Company Operations Platform

**Feature**: [Unified Company Operations Platform](../spec.md)
**Status**: Planning

## Overview

The implementation is broken down into 11 work packages, following a sequence from infrastructure and identity to core business modules (Projects, Timesheets, Leaves) and final engagement features (Polls, Announcements).

---

## Phase 1: Foundation & Identity

### WP01: Project Foundation
- **Goal**: Bootstrap the monorepo, Docker environment, and shared libraries.
- **Priority**: High
- **Subtasks**:
  - [x] T001: Bootstrap Laravel 12 & React 18 (Vite) monorepo structure.
  - [x] T002: Set up Docker configuration (NGINX, PostgreSQL, Redis).
  - [x] T003: Configure Authentication (Laravel Sanctum) and Spatie Permission.
  - [x] T004: Implement Core Module with shared Enums and Base Models.
  - [x] T005: Set up React Query and Zustand state management.
  - [x] T006: Integrate Shadcn/ui and Radix primitives into frontend.
- **Implementation Sketch**: Initialize Laravel with Vite, configure Docker Compose, set up directory structure for Domain Modules.
- **Dependencies**: None
- **Prompt Size**: ~350 lines

### WP02: IAM & User Profiles
- **Goal**: Implement robust RBAC/PBAC and user management.
- **Priority**: High
- **Subtasks**:
  - [x] T007: Implement User model and migration (IAM Module).
  - [x] T008: Build API for User Profile (Read/Update).
  - [x] T009: Implement RBAC + PBAC logic (Roles, Permissions, Scopes).
  - [x] T010: Create Admin UI for Role & Permission management.
  - [x] T011: Implement Permission Middleware for API route protection.
- **Implementation Sketch**: Extend Spatie models with custom scope fields, build profile endpoints, and create the admin permission grid.
- **Dependencies**: WP01
- **Prompt Size**: ~300 lines

---

## Phase 2: Core Business Modules

### WP03: Project Management
- **Goal**: Manage projects and team assignments with scoping.
- **Priority**: Medium
- **Subtasks**:
  - [x] T012: Implement Project model and migrations (Projects Module).
  - [x] T013: Build API for Project CRUD and Member assignment.
  - [x] T014: Implement UI for Project Management (Admin/PM views).
  - [x] T015: Add Project scoping logic to IAM system.
- **Implementation Sketch**: Create project entities, member relationship tables, and the management dashboard.
- **Dependencies**: WP02
- **Prompt Size**: ~250 lines

### WP04: Timesheet Core
- **Goal**: Backend logic for time reporting.
- **Priority**: Medium
- **Subtasks**:
  - [x] T016: Implement TimesheetEntry model and migrations (Timesheets Module).
  - [x] T017: Build API for Timesheet reporting (Create/Read/Edit).
  - [x] T018: Implement validation for time types and mandatory comments.
- **Implementation Sketch**: Define timesheet schema, implement validation rules for various time types, and create core reporting endpoints.
- **Dependencies**: WP03
- **Prompt Size**: ~200 lines

### WP05: Timesheet UI & Approvals
- **Goal**: Frontend for time reporting and manager approvals.
- **Priority**: Medium
- **Subtasks**:
  - [ ] T019: Build Timesheet UI (User reporting view).
  - [ ] T020: Implement Timesheet Approval/Correction API for Managers.
- **Implementation Sketch**: Create a list/grid view for daily/weekly reporting and a manager-only approval dashboard.
- **Dependencies**: WP04
- **Prompt Size**: ~150 lines

### WP06: Leave Management Backend
- **Goal**: Leave requests and automated balance tracking.
- **Priority**: Medium
- **Subtasks**:
  - [ ] T021: Implement LeaveType and LeaveRequest models/migrations.
  - [ ] T022: Build API for Leave Request submission and balance tracking.
  - [ ] T025: Implement Leave Balance calculation logic (Accruals/Remaining).
- **Implementation Sketch**: Create leave request entities, implement business logic for balance deduction and accrual.
- **Dependencies**: WP02
- **Prompt Size**: ~250 lines

### WP07: Leave Approvals & Audit
- **Goal**: Approval flow with audit trail (signatures).
- **Priority**: Medium
- **Subtasks**:
  - [ ] T023: Implement Leave Approval flow with Audit Log "signatures".
  - [ ] T024: Build Leave Management UI (Request form, Manager approval list).
  - [ ] T039: Implement central AuditLog system for state tracking.
- **Implementation Sketch**: Create the approval interface and the immutable audit logging system for state snapshots.
- **Dependencies**: WP06
- **Prompt Size**: ~250 lines

---

## Phase 3: Visibility & Reporting

### WP08: Unified Calendar
- **Goal**: Centralized view of time and absences.
- **Priority**: Low
- **Subtasks**:
  - [ ] T026: Implement Unified Calendar API (Aggregating Timesheets, Leaves, Holidays).
  - [ ] T027: Integrate FullCalendar React component into frontend.
  - [ ] T028: Implement Calendar views (Day/Week/Month/Year) with role-based scoping.
- **Implementation Sketch**: Build a transformer that combines different models into a unified event format for FullCalendar.
- **Dependencies**: WP05, WP07
- **Prompt Size**: ~250 lines

### WP09: Reporting & Exports
- **Goal**: Data extraction in CSV/PDF formats.
- **Priority**: Low
- **Subtasks**:
  - [ ] T029: Implement Reporting Service (Filtering by User/Project/Period).
  - [ ] T030: Build CSV export functionality (Queued job).
  - [ ] T031: Build PDF export functionality (Queued job using DomPDF).
  - [ ] T032: Create Reporting UI with filters and export buttons.
- **Implementation Sketch**: Integrate Laravel Excel and DomPDF, set up export jobs with S3 storage.
- **Dependencies**: WP05, WP07
- **Prompt Size**: ~300 lines

---

## Phase 4: Engagement & Polish

### WP10: Announcements & Birthdays
- **Goal**: Internal communications and automated greetings.
- **Priority**: Low
- **Subtasks**:
  - [ ] T033: Implement Announcement system (Model, Migration, API).
  - [ ] T034: Build Announcement UI (Creation for Admin, Viewing for Users).
  - [ ] T035: Implement Birthday Automation (Scheduled job to post greetings).
- **Implementation Sketch**: Create announcement targets, build the display component, and schedule the birthday bot.
- **Dependencies**: WP02
- **Prompt Size**: ~250 lines

### WP11: Real-time Polls
- **Goal**: Interactive polling and final system polish.
- **Priority**: Low
- **Subtasks**:
  - [ ] T036: Implement Polls system (Model, Migration, API).
  - [ ] T037: Set up Laravel Reverb for real-time Poll updates.
  - [ ] T038: Build Polls UI with live result updates.
  - [ ] T040: Final system-wide responsive UI audit and performance tuning.
- **Implementation Sketch**: Build the polling logic, configure Reverb broadcasting, and perform final UX refinements.
- **Dependencies**: WP10
- **Prompt Size**: ~350 lines
