<?php

namespace App\Modules\Core;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class ModuleServiceProvider extends ServiceProvider
{
    /**
     * The module name.
     */
    protected string $moduleName = '';

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->moduleName) {
            $this->registerRoutes();
            $this->registerMigrations();
        }
    }

    /**
     * Register the module routes.
     */
    protected function registerRoutes(): void
    {
        $routeFile = app_path("Modules/{$this->moduleName}/Routes/api.php");

        if (file_exists($routeFile)) {
            Route::prefix('api')
                ->middleware('api')
                ->group($routeFile);
        }
    }

    /**
     * Register the module migrations.
     */
    protected function registerMigrations(): void
    {
        $migrationPath = app_path("Modules/{$this->moduleName}/Database/Migrations");

        if (is_dir($migrationPath)) {
            $this->loadMigrationsFrom($migrationPath);
        }
    }
}
