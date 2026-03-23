# Quickstart: Internal Operations Platform

## Prerequisites
- Node.js (v18+)
- Docker (for PostgreSQL & Redis)
- pnpm (recommended for monorepo workspace)

## Project Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Database Setup**
   Ensure Docker is running and start the database:
   ```bash
   docker-compose up -d
   ```

3. **Environment Variables**
   Copy the example environment files for both apps:
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

4. **Run Migrations**
   Navigate to the API app and run Drizzle migrations:
   ```bash
   cd apps/api
   pnpm db:generate
   pnpm db:push
   ```

## Running the Application

1. **Start Backend (NestJS)**
   ```bash
   cd apps/api
   pnpm start:dev
   ```

2. **Start Frontend (React)**
   ```bash
   cd apps/web
   pnpm dev
   ```

## Core Technologies
- **NestJS** (Backend API located in `apps/api`)
- **React 18** (Frontend located in `apps/web`)
- **Drizzle ORM** (Database schemas at `apps/api/src/db/schema.ts`)
- **shadcn/ui** (Frontend components)
- **TailwindCSS** (Frontend styling)