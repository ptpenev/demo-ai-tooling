---
work_package_id: WP10
title: Announcements & Birthdays
lane: "doing"
dependencies: []
base_branch: master
base_commit: ce8d3e11c7d48d93f27ba98c8ed9038c68c80d9b
created_at: '2026-03-16T11:51:44.678958+00:00'
subtasks: [T033, T034, T035]
shell_pid: "2988"
agent: "gemini-3-flash-preview-reviewer"
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

## Activity Log

- 2026-03-16T11:51:45Z – gemini-3-flash-preview – shell_pid=2648 – lane=doing – Assigned agent via workflow command
- 2026-03-16T11:53:22Z – gemini-3-flash-preview – shell_pid=2648 – lane=for_review – Announcements & Birthdays system implemented. Includes models/migrations for targeted announcements, API for user feed and admin creation, React-based feed UI, and a scheduled console command for automated birthday greetings.
- 2026-03-16T11:55:00Z – gemini-3-flash-preview-reviewer – shell_pid=2988 – lane=doing – Started review via workflow command
