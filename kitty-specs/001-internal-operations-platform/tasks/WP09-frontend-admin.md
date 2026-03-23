---
work_package_id: WP09
title: Frontend Admin & Roles UI
lane: planned
dependencies: []
subtasks: [T026, T027]
---

# WP09: Frontend Admin UI

## Objective
Build the screens for managing user profiles, roles, and administrative configurations.

## Context
These interfaces are strictly for authorized personnel (Super Admins / Admins) to manage system access and edit profile details.

## Implementation Guidance

### T026: Implement Users & Roles Management UI
1. Create `/admin/roles` to list, create, and edit roles (requires calling `GET/POST/PATCH /api/v1/roles`).
2. Create a UI component to assign permissions to a role via a multi-select or checkbox list.
3. Create `/admin/users` to list users and assign roles (`POST /api/v1/users/:id/roles`).

### T027: Implement Profile Page
1. Create `/profile` for users to view and edit their own basic information (`GET /api/v1/users/me` and `PATCH /api/v1/users/me`).
2. Display the user's current assigned roles and active permissions.

## Validation & Definition of Done
- [ ] Admins can create and edit roles, assigning specific permissions.
- [ ] Admins can assign roles to specific users.
- [ ] Users can edit their own basic profile info.

## Reviewer Notes
Validate that forms use `shadcn/ui` and `React Hook Form` for strict client-side validation using `Zod` before submitting to the API.