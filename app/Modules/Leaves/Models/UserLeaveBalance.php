<?php

namespace App\Modules\Leaves\Models;

use App\Modules\Users\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserLeaveBalance extends Model
{
    protected $fillable = ['user_id', 'year', 'total_quota', 'used_days'];

    protected $casts = [
        'total_quota' => 'float',
        'used_days' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
