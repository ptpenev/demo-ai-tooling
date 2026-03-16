---
work_package_id: WP08
title: Unified Calendar
lane: planned
dependencies: []
subtasks: [T026, T027, T028]
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
