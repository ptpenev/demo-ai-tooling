# Implementation Plan: Internal Operations Platform
*Path: kitty-specs/001-internal-operations-platform/plan.md*

**Branch**: `001-internal-operations-platform` | **Date**: 2026-03-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `kitty-specs/001-internal-operations-platform/spec.md`

## Summary

Build a comprehensive internal web platform (Monorepo with NestJS backend, React frontend) for time reporting, leave management, project workload visibility, announcements, and polls, heavily guarded by an RBAC/PBAC security system.

## Technical Context

**Language/Version**: TypeScript, Node.js, React 18
**Primary Dependencies**: NestJS, Drizzle ORM, React Query, Zustand, shadcn/ui, TailwindCSS
**Storage**: PostgreSQL, Redis (for NestJS Throttler/Caching if needed)
**Testing**: Jest (Unit/Integration tests), 80% coverage target
**Target Platform**: Web-based system (responsive for Desktop, Tablet, Mobile)
**Project Type**: Monorepo (`apps/api` and `apps/web`)
**Performance Goals**: Support at least 200 concurrent users without degradation
**Constraints**: Docker-only deployment
**Scale/Scope**: Company-wide internal operations (Timesheets, Leaves, Projects, Calendars, Polls, RBAC)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Pass**: Separation of backend (`apps/api`) and frontend (`apps/web`).
- **Pass**: Backend is strictly REST API without template engines.
- **Pass**: Data access strictly goes through Drizzle ORM and Repository pattern.
- **Pass**: Frontend styling uses TailwindCSS and shadcn/ui.
- **Pass**: Endpoints are properly versioned and utilize DTOs.

## Project Structure

### Documentation (this feature)

```
kitty-specs/001-internal-operations-platform/
├── plan.md              # This file
├── research.md          # Technical decisions (Skipped, used constitution defaults)
├── data-model.md        # Database schemas and Drizzle entity maps
├── quickstart.md        # Setup guide for the monorepo
├── contracts/           
│   └── endpoints.md     # API contract documentation
└── tasks.md             # Phase 2 output (/spec-kitty.tasks)
```

### Source Code (repository root)

```
apps/
├── api/                  # NestJS Backend
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts
│   │   │   └── migrations/
│   │   └── modules/
│   │       ├── users/
│   │       ├── auth/
│   │       ├── projects/
│   │       ├── timesheets/
│   │       ├── leaves/
│   │       ├── calendar/
│   │       ├── reports/
│   │       ├── announcements/
│   │       ├── polls/
│   │       ├── rbac/
│   │       └── audit/
│   └── package.json
└── web/                  # React Frontend
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── features/
    │   ├── store/
    │   └── utils/
    └── package.json
```

**Structure Decision**: Monorepo as defined in the project constitution (`apps/api` for NestJS, `apps/web` for React).

## Complexity Tracking

*No violations detected. Aligning with constitutional requirements.*