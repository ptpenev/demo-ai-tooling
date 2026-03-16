<?php

namespace App\Modules\Leaves\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    protected $fillable = ['name', 'is_paid', 'is_system'];

    protected $casts = [
        'is_paid' => 'boolean',
        'is_system' => 'boolean',
    ];
}
