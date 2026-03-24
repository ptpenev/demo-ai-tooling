# Research phase: Internal Operations Platform

Since the technical stack is explicitly defined in the constitution and the user requested to use defaults, no extensive research was necessary.

## Decisions Made Based on Constitution
- **Backend**: NestJS with strict module separation and DTO validation.
- **Frontend**: React 18, React Query (for remote data), Zustand (for local state), and shadcn/ui.
- **Security System**: Implement NestJS Guards with custom decorators to enforce PBAC checks based on roles and scopes stored via Drizzle ORM.
- **Database**: PostgreSQL with Drizzle ORM.