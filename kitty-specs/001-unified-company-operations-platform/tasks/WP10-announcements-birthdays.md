---
work_package_id: WP10
title: Announcements & Birthdays
lane: planned
dependencies: []
subtasks: [T033, T034, T035]
---

# WP10: Announcements & Birthdays

## Objective
Implement targeted internal announcements and automated birthday greetings.

## Guidance

### T033: Announcement System
- Create `Announcement` and `AnnouncementTarget` models.
- Fields: `title`, `content`, `valid_from`, `valid_until`, `created_by`.
- Logic for targeting specific Teams, Projects, or Users.

### T034: Announcement UI
- Build an announcement feed on the Dashboard.
- Create an Admin interface for publishing and targeting announcements.

### T035: Birthday Automation
- Create a `PostBirthdayAnnouncements` scheduled job (Laravel Scheduler).
- The job runs daily, checks for users with birthdays, and creates a global announcement.

## Definition of Done
- [ ] Targeted announcements only appear for the intended audience.
- [ ] Announcements automatically expire based on their validity period.
- [ ] Birthday greetings are automatically posted on the correct day.
