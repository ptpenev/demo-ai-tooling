<?php

namespace App\Modules\Audit\Providers;

use App\Modules\Core\ModuleServiceProvider;
use App\Modules\Audit\Services\Auditor;

class AuditServiceProvider extends ModuleServiceProvider
{
    protected string $moduleName = 'Audit';

    public function register(): void
    {
        parent::register();

        $this->app->singleton(Auditor::class, function ($app) {
            return new Auditor();
        });
    }
}
