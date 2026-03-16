---
work_package_id: WP11
title: Real-time Polls & Polish
lane: planned
dependencies: []
subtasks: [T036, T037, T038, T040]
---

# WP11: Real-time Polls & Polish

## Objective
Implement interactive polls with real-time updates and perform final system-wide refinements.

## Guidance

### T036: Polls System
- Create `Poll`, `PollOption`, and `PollVote` models.
- Support single/multiple choice and anonymity settings.
- Implement API for voting and result retrieval.

### T037: Laravel Reverb Setup
- Configure Laravel Reverb for WebSocket broadcasting.
- Broadcast `PollVoteReceived` event when a vote is cast.

### T038: Polls UI with Live Results
- Build the `Poll` component in React.
- Use `useEcho` (or similar Reverb hook) to update results in real-time without page refresh.
- Show results as charts or progress bars.

### T040: Final Audit & Polish
- Conduct a full responsive audit on mobile and tablet.
- Fix minor UI inconsistencies and performance bottlenecks in React Query.
- Ensure all "Empty States" (e.g., no timesheets, no announcements) are handled gracefully.

## Definition of Done
- [ ] Users can vote in polls and see results update instantly.
- [ ] Anonymous polls do not leak user IDs in results.
- [ ] Application is fully responsive and feels polished across all modules.
