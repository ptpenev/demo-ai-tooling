# Research: Unified Company Operations Platform

## Decision 1: Domain-Driven Modular Architecture
**Decision**: Use Laravel's standard directory structure but grouped into `app/Modules/` for core business logic, as per technical specification.
**Rationale**: High modularity while maintaining a single codebase. Loose coupling is achieved through events and service providers.
**Alternatives Considered**: Strict hexagonal architecture (rejected as overly complex for initial phase), traditional flat Laravel structure (rejected for poor modularity).

## Decision 2: Approval Record & Audit Trail
**Decision**: Implement "Digital Signatures" as a series of immutable audit log entries recording `actor_id`, `state_snapshot`, and `timestamp`.
**Rationale**: Provides full accountability and transparency without the cryptographic overhead of key management.
**Alternatives Considered**: PGP/GPG signing (too complex for user onboarding), Blockchain/Ledger (overkill).

## Decision 3: Hybrid Real-time Strategy
**Decision**: Use React Query refetching (every 20s) for status/notification updates; use Laravel Reverb + WebSockets for live Poll results.
**Rationale**: Simplifies infrastructure for 90% of use cases while providing high-performance live updates where they matter most.
**Alternatives Considered**: Full WebSocket for everything (high resource cost), Polling for everything (poor UX for polls).

## Decision 4: UI/UX Foundation
**Decision**: Use Shadcn/ui + Tailwind CSS.
**Rationale**: Combines accessible Radix primitives with full styling control. Monorepo approach (copying components) ensures long-term maintainability.
**Alternatives Considered**: Mantine (locked dependency), Material UI (rigid design system).
