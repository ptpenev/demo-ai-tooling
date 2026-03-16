<?php

namespace App\Modules\Leaves\Services;

use App\Modules\Leaves\Models\LeaveRequest;
use App\Modules\Leaves\Models\UserLeaveBalance;
use Carbon\Carbon;

class LeaveBalanceService
{
    /**
     * Calculate remaining leave balance for a user in a specific year.
     */
    public function getRemainingBalance(int $userId, int $year): float
    {
        $balance = UserLeaveBalance::firstOrCreate(
            ['user_id' => $userId, 'year' => $year],
            ['total_quota' => 20.0, 'used_days' => 0.0]
        );

        return $balance->total_quota - $balance->used_days;
    }

    /**
     * Deduct approved leave days from user balance.
     */
    public function deductBalance(LeaveRequest $request): void
    {
        if ($request->status !== 'APPROVED') {
            return;
        }

        $year = $request->start_date->year;
        
        $balance = UserLeaveBalance::firstOrCreate(
            ['user_id' => $request->user_id, 'year' => $year],
            ['total_quota' => 20.0, 'used_days' => 0.0]
        );

        $balance->increment('used_days', $request->total_days);
    }

    /**
     * Calculate business days between two dates.
     * Simple implementation: excluding weekends.
     */
    public function calculateBusinessDays(Carbon $start, Carbon $end): float
    {
        $days = 0;
        $current = $start->copy();

        while ($current <= $end) {
            if (!$current->isWeekend()) {
                $days++;
            }
            $current->addDay();
        }

        return (float) $days;
    }
}
