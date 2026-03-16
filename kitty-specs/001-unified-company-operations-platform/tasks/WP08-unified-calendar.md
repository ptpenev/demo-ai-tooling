---
work_package_id: WP08
title: Unified Calendar
lane: "doing"
dependencies: []
base_branch: master
base_commit: 21d1f50915ac765ba1914b817b2a59b192bdcf5a
created_at: '2026-03-16T11:43:21.944158+00:00'
subtasks: [T026, T027, T028]
shell_pid: "11752"
agent: "gemini-3-flash-preview"
---

# WP08: Unified Calendar

## Objective
Visualize all company time data (timesheets, leaves, holidays) in a single interactive calendar.

## Guidance

### T026: Unified Calendar API
- Create a `CalendarController` that aggregates data from `TimesheetEntry`, `LeaveRequest`, and a `Holidays` table/config.
- Transform data into a standard "Event" object compatible with FullCalendar.
- Apply role-based scoping (Personal vs Team vs All).

### T027: FullCalendar Integration
- Install `@fullcalendar/react` and necessary plugins (dayGrid, timeGrid, list).
- Build the `Calendar` component in `resources/js/components/Calendar.tsx`.

### T028: Calendar Views & Scoping
- Implement switching between Day, Week, Month, and Year views.
- Add filters for specific projects or team members (if permitted by scope).

## Definition of Done
- [ ] Users see their own reported time and approved leaves in the calendar.
- [ ] Managers see team-wide visibility based on their scope.
- [ ] Holidays are clearly marked on all calendar views.

## Activity Log

- 2026-03-16T11:43:23Z – gemini-3-flash-preview – shell_pid=11752 – lane=doing – Assigned agent via workflow command
