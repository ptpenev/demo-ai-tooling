---
work_package_id: WP04
title: Timesheet Core
lane: planned
dependencies: []
subtasks: [T016, T017, T018]
---

# WP04: Timesheet Core

## Objective
Implement the backend foundation for time reporting, including data structures and validation.

## Guidance

### T016: TimesheetEntry Model & Migration
- Create `TimesheetEntry` model in `app/Modules/Timesheets/Models/`.
- Fields: `user_id`, `project_id`, `date`, `hours`, `time_type`, `comment`.
- Add foreign keys and indexes for performance.

### T017: Timesheet Reporting API
- Build `TimesheetController` with `index`, `store`, and `update` methods.
- Implement `TimesheetRequest` for validation.
- Ensure users can only report time for projects they are assigned to (if scope=project).

### T018: Time Type Validation
- Enforce `TimeType` enum (WORKING, OVERTIME, HOLIDAY, CLIENT_EXTRA).
- Make `comment` mandatory for all entries.
- Add business rules: maximum 24 hours per day, only reporting for active projects.

## Definition of Done
- [ ] Timesheet entries can be created via POST API with valid data.
- [ ] Validation errors are returned for missing comments or invalid time types.
- [ ] Users are blocked from reporting time for projects they don't belong to.
