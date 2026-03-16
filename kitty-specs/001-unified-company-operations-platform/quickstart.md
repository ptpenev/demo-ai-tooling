# Quickstart: Unified Company Operations Platform

## Development Setup

### 1. Requirements
- Docker & Docker Compose
- PHP 8.3+ (Local for tooling)
- Node.js 20+

### 2. Initialization
```bash
# Clone and enter repo
# Copy environment files
cp .env.example .env

# Spin up infrastructure
docker-compose up -d

# Install dependencies
composer install
npm install

# Run migrations and seeders
php artisan migrate --seed
```

### 3. Running the App
- Backend: `php artisan serve` (or via Docker NGINX)
- Frontend: `npm run dev` (Vite)
- Real-time: `php artisan reverb:start`

## Module Architecture
New features should be added under `app/Modules/`. Each module should contain its own Controllers, Models, and Policies. Shared logic belongs in `app/Modules/Core/`.
