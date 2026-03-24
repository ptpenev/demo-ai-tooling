---
work_package_id: WP13
title: Frontend Communications UI
lane: "doing"
dependencies: []
base_branch: second-demo-nestjs
base_commit: 818d2e2d7e444735dd1838977d7f5828406b2e05
created_at: '2026-03-24T10:00:42.373215+00:00'
subtasks: [T034, T035]
shell_pid: "5036"
agent: "opencode"
---

# WP13: Frontend Communications UI

## Objective
Implement UI for reading internal announcements and participating in polls.

## Context
This functionality fosters internal communication and company culture.

## Implementation Guidance

### T034: Implement Announcements Display
1. Create a "Dashboard" or "Home" component to display active announcements (`GET /api/v1/announcements`).
2. Display announcements as styled cards (`shadcn/ui` Card).
3. Admins should see a button to "Create Announcement" which opens a modal/form (`POST /api/v1/announcements`). Include fields for targeting specific projects or teams.

### T035: Implement Polls Display & Voting UI
1. Fetch active polls (`GET /api/v1/polls`) and display them below the announcements.
2. For each poll, display a list of radio buttons or checkboxes (`shadcn/ui` RadioGroup/Checkbox) based on the `allow_multiple` flag.
3. Submit the user's vote via `POST /api/v1/polls/:id/vote`.
4. If a user has already voted (or if results are public), display a progress bar (`shadcn/ui` Progress) for each option showing the current vote distribution.

## Validation & Definition of Done
- [ ] Users can read active announcements and see birthday notifications.
- [ ] Admins can create targeted announcements.
- [ ] Users can vote on polls and instantly see the updated results.
- [ ] Users cannot vote multiple times on the same poll.

## Reviewer Notes
Ensure that the voting UI immediately reflects the new vote totals without requiring a full page reload, utilizing React Query's mutation hooks effectively.

## Activity Log

- 2026-03-24T10:00:43Z – opencode – shell_pid=5036 – lane=doing – Assigned agent via workflow command
