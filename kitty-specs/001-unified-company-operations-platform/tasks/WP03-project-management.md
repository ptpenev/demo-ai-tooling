---
work_package_id: WP03
title: Project Management
lane: "doing"
dependencies: []
base_branch: master
base_commit: 3aedd6089ec0f611be7f8ce8132415f88c0bb872
created_at: '2026-03-16T11:14:06.481570+00:00'
subtasks: [T012, T013, T014, T015]
shell_pid: "6760"
---

# WP03: Project Management

## Objective
Implement project lifecycle management and team assignment with integrated scoping.

## Guidance

### T012: Project Model & Migrations
- Create `Project` model in `app/Modules/Projects/Models/`.
- Fields: `name`, `description`, `is_active`, `project_manager_id`, `team_lead_id`.
- Create `ProjectMember` pivot table/model.

### T013: Project API
- Build `ProjectController` for CRUD operations.
- Add endpoints to assign/remove members and change roles.
- Use `ProjectResource` for consistent API output.

### T014: Project Management UI
- Create `Projects` list and detail pages in React.
- Implement forms for project creation and member management.
- Use Shadcn/ui `Form`, `Select`, and `DataTable`.

### T015: Project Scoping Logic
- Integrate `project` scope into the IAM system.
- If a user has `timesheet.create` with scope `project`, they must be a member of that project.

## Definition of Done
- [ ] Projects can be created and archived via UI.
- [ ] Users can be assigned to projects with specific roles (PM, Team Lead, Member).
- [ ] Project scoping correctly restricts access to project-specific data.
