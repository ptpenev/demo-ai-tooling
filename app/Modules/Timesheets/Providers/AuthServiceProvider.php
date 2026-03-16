<?php

namespace App\Modules\Timesheets\Providers;

use App\Modules\Timesheets\Models\TimesheetEntry;
use App\Modules\Timesheets\Policies\TimesheetPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        TimesheetEntry::class => TimesheetPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
