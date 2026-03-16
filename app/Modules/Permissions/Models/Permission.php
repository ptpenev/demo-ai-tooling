<?php

namespace App\Modules\Permissions\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'guard_name',
        'code',
        'module',
        'resource',
        'action',
        'scope',
        'is_project_specific',
        'is_active',
    ];
}
