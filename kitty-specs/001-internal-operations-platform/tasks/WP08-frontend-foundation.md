---
work_package_id: WP08
title: Frontend Foundation & Auth
lane: "for_review"
dependencies: []
base_branch: second-demo-nestjs
base_commit: 79a8093e6c0c555c131ade44156c7ae778b3498f
created_at: '2026-03-24T09:10:23.258639+00:00'
subtasks: [T023, T024, T025]
shell_pid: "1484"
agent: "opencode"
---

# WP08: Frontend Foundation & Auth

## Objective
Set up the React application shell, install necessary libraries, and implement the login flow to secure the frontend routes.

## Context
This is the base UI layer. React Query handles remote data, Zustand handles local auth state, and shadcn/ui provides the component library.

## Implementation Guidance

### T023: Setup React App
1. Navigate to `apps/web`.
2. Install `shadcn/ui` components (e.g., Button, Input, Form, Card).
3. Configure `React Query` Provider and `Zustand` store for Auth state.

### T024: Implement Login Page & Auth Context
1. Build `/login` page using React Hook Form and Zod for validation.
2. Create a generic API client (e.g., using `axios` or native `fetch`) that attaches the JWT token to subsequent requests.
3. Call `POST /api/v1/auth/login` and store the resulting token securely.

### T025: Implement App Layout & Navigation
1. Create a `ProtectedLayout` component that verifies Auth state and redirects to `/login` if unauthenticated.
2. Build a sidebar/navbar displaying links based on the user's active permissions (fetched via `GET /api/v1/users/me`).

## Validation & Definition of Done
- [ ] The app renders without errors using Tailwind CSS.
- [ ] Users can log in using the `/login` form.
- [ ] Unauthorized users are redirected to `/login`.
- [ ] The navigation menu successfully hides links the user is not authorized to see.

## Reviewer Notes
Ensure that the token is managed securely and that the generic API client correctly handles 401 Unauthorized responses by logging the user out.

## Activity Log

- 2026-03-24T09:10:24Z – opencode – shell_pid=1484 – lane=doing – Assigned agent via workflow command
- 2026-03-24T09:20:50Z – opencode – shell_pid=1484 – lane=for_review – Ready for review
