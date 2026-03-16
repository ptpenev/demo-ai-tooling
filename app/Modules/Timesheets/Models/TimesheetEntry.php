<?php

namespace App\Modules\Timesheets\Models;

use App\Modules\Projects\Models\Project;
use App\Modules\Users\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimesheetEntry extends Model
{
    protected $fillable = [
        'user_id',
        'project_id',
        'date',
        'hours',
        'time_type',
        'comment',
        'status',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'date' => 'date',
        'hours' => 'float',
        'approved_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
