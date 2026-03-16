<?php

namespace App\Modules\Leaves\Providers;

use App\Modules\Leaves\Models\LeaveRequest;
use App\Modules\Leaves\Policies\LeaveRequestPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        LeaveRequest::class => LeaveRequestPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
