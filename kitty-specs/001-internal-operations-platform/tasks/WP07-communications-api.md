---
work_package_id: WP07
title: Communications Backend
lane: "doing"
dependencies: []
base_branch: second-demo-nestjs
base_commit: 2637efcfa127a048310f790642a868db7e7ae537
created_at: '2026-03-24T09:00:25.815934+00:00'
subtasks: [T019, T020, T021, T022]
shell_pid: "21128"
---

# WP07: Communications Backend

## Objective
Implement Announcements and Polls, including the automated Birthday CRON job.

## Context
These features facilitate internal company culture and communication.

## Implementation Guidance

### T019: Create Schemas
1. Define `announcements`, `announcement_targets` in `schema.ts`.
2. Define `polls`, `poll_options`, and `poll_votes` in `schema.ts`.

### T020: Implement Announcements API & Birthday CRON
1. Implement `POST /api/v1/announcements` (Admin/HR only) and `GET /api/v1/announcements` (filters based on targets).
2. Create a NestJS `@Cron()` job that runs daily at a specific time. It should query `users` whose birthdays match today, and automatically insert an announcement into the database targeting all users.

### T021: Implement Polls API
1. Implement `POST /api/v1/polls` (Create poll with options).
2. Implement `GET /api/v1/polls` (Fetch active polls).
3. Implement `POST /api/v1/polls/:id/vote` (Cast vote). If `is_anonymous` is true, do not link the `user_id` to the `poll_votes` entry.

### T022: Write Unit/Integration Tests
1. Test targeting logic for announcements (a user not in the target group should not see the announcement).
2. Test that anonymous poll votes successfully record the vote without a user ID.

## Validation & Definition of Done
- [ ] Schemas migrated.
- [ ] Announcements are filterable by target.
- [ ] Birthday CRON successfully inserts an announcement.
- [ ] Polls can be created, and anonymous votes are correctly anonymized.

## Reviewer Notes
Check the CRON job configuration to ensure it does not fire continuously or at unintended intervals.
