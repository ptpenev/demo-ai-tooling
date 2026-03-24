# Implementation Tasks: Internal Operations Platform

This document outlines the work packages for implementing the internal operations platform.

## Setup & Foundational Work

### WP01: Foundation Setup & Auth
**Goal**: Set up database connection, base user schemas, RBAC guards, and authentication.
**Independent Test**: API can authenticate a user and return a JWT token, with protected routes rejecting unauthorized access.
- [x] T001: Configure Drizzle ORM and setup database connection in NestJS
- [x] T002: Create `users`, `roles`, `permissions`, `user_roles`, `role_permissions` schemas
- [x] T003: Implement PBAC/RBAC Guards & Decorators in NestJS
- [x] T004: Implement Auth Login and User Profile API endpoints (JWT)
**Estimated Size**: ~400 lines
**Parallel Opportunities**: None (blocking for all other modules)
**Dependencies**: None

### WP02: Roles & Permissions API
**Goal**: Allow Admins to manage roles and assignments.
**Independent Test**: Admin can create a new role with specific permissions and assign it to a user.
- [x] T005: Create Roles & Permissions CRUD API
- [x] T006: Create Role Assignment API (global and project-scoped)
- [x] T007: Write Integration Tests for RBAC/PBAC
**Estimated Size**: ~350 lines
**Parallel Opportunities**: Can run alongside Frontend Foundation
**Dependencies**: WP01

## Backend Feature Modules

### WP03: Projects Backend
**Goal**: API to manage projects and team assignments.
**Independent Test**: Can create a project and assign a Team Lead to it.
- [x] T008: Create `projects` and `project_members` schemas
- [x] T009: Implement Projects API (CRUD & member assignment)
- [x] T010: Write Unit/Integration Tests for Projects
**Estimated Size**: ~300 lines
**Parallel Opportunities**: Yes [P]
**Dependencies**: WP01

### WP04: Timesheets Backend
**Goal**: API to log and manage time entries.
**Independent Test**: Can log 8 hours of working time against an active project.
- [ ] T011: Create `timesheet_entries` schema
- [ ] T012: Implement Timesheets API (Create, Update, Delete, List)
- [ ] T013: Write Unit/Integration Tests for Timesheets
**Estimated Size**: ~350 lines
**Parallel Opportunities**: Yes [P]
**Dependencies**: WP03

### WP05: Leave Management Backend
**Goal**: API to submit and approve leave requests.
**Independent Test**: Can submit a leave request and calculate remaining balance.
- [ ] T014: Create `leave_types` and `leave_requests` schemas
- [ ] T015: Implement Leave Requests API (Submit, Approve/Reject, Balances)
- [ ] T016: Write Unit/Integration Tests for Leaves
**Estimated Size**: ~350 lines
**Parallel Opportunities**: Yes [P]
**Dependencies**: WP01

### WP06: Calendar Aggregation API
**Goal**: Unified endpoint to feed the frontend calendar.
**Independent Test**: Can fetch timesheets and leaves for a specific month in one API call.
- [ ] T017: Implement Calendar Aggregation API (Timesheets + Leaves)
- [ ] T018: Write Calendar Aggregation Tests
**Estimated Size**: ~250 lines
**Parallel Opportunities**: Yes
**Dependencies**: WP04, WP05

### WP07: Communications Backend
**Goal**: API for announcements and polls.
**Independent Test**: Can publish an announcement and cast a vote on a poll.
- [ ] T019: Create schema for Announcements and Polls
- [ ] T020: Implement Announcements API and Birthday CRON
- [ ] T021: Implement Polls API (List, Vote)
- [ ] T022: Write Unit/Integration Tests for Communications
**Estimated Size**: ~400 lines
**Parallel Opportunities**: Yes [P]
**Dependencies**: WP03

## Frontend Implementation

### WP08: Frontend Foundation & Auth
**Goal**: Set up React app structure, styling, state, and authentication.
**Independent Test**: User can log in via UI and see the protected layout.
- [ ] T023: Setup React App (shadcn/ui, Tailwind, React Query, Zustand)
- [ ] T024: Implement Login Page & Auth Context
- [ ] T025: Implement App Layout & Navigation (Role-based visibility)
**Estimated Size**: ~350 lines
**Parallel Opportunities**: Yes
**Dependencies**: WP01

### WP09: Frontend Admin UI
**Goal**: UI for managing users, roles, and profiles.
**Independent Test**: Admin can assign a role to a user via the UI.
- [ ] T026: Implement Users & Roles Management UI
- [ ] T027: Implement Profile Page
**Estimated Size**: ~250 lines
**Parallel Opportunities**: Yes
**Dependencies**: WP02, WP08

### WP10: Frontend Timesheets UI
**Goal**: UI for logging and viewing timesheets.
**Independent Test**: Employee can log hours using a form.
- [ ] T028: Implement Timesheet Entry Form
- [ ] T029: Implement Timesheet List/View
**Estimated Size**: ~250 lines
**Parallel Opportunities**: Yes
**Dependencies**: WP04, WP08

### WP11: Frontend Leaves UI
**Goal**: UI for requesting leave and manager approvals.
**Independent Test**: Manager can approve a pending leave request via UI.
- [ ] T030: Implement Leave Request Form
- [ ] T031: Implement Leave Balances & Approvals View
**Estimated Size**: ~250 lines
**Parallel Opportunities**: Yes
**Dependencies**: WP05, WP08

### WP12: Frontend Calendar UI
**Goal**: Visual calendar combining timesheets and leaves.
**Independent Test**: User sees their logged hours and approved leaves on a monthly grid.
- [ ] T032: Integrate FullCalendar React Component
- [ ] T033: Connect Calendar to Aggregation API
**Estimated Size**: ~250 lines
**Parallel Opportunities**: Yes
**Dependencies**: WP06, WP08

### WP13: Frontend Communications UI
**Goal**: UI for reading announcements and voting on polls.
**Independent Test**: User can click a poll option and see results.
- [ ] T034: Implement Announcements Display
- [ ] T035: Implement Polls Display & Voting UI
**Estimated Size**: ~250 lines
**Parallel Opportunities**: Yes
**Dependencies**: WP07, WP08