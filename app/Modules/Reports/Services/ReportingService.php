<?php

namespace App\Modules\Reports\Services;

use App\Modules\Timesheets\Models\TimesheetEntry;
use App\Modules\Leaves\Models\LeaveRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ReportingService
{
    /**
     * Get filtered timesheet entries.
     */
    public function getFilteredTimesheets(array $filters): Collection
    {
        $query = TimesheetEntry::with(['user', 'project']);

        $this->applyFilters($query, $filters);

        return $query->latest('date')->get();
    }

    /**
     * Get filtered leave requests.
     */
    public function getFilteredLeaves(array $filters): Collection
    {
        $query = LeaveRequest::with(['user', 'type']);

        $this->applyFilters($query, $filters);

        return $query->latest('start_date')->get();
    }

    /**
     * Apply common filters to a query.
     */
    protected function applyFilters(Builder $query, array $filters): void
    {
        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['project_id']) && $query->getModel() instanceof TimesheetEntry) {
            $query->where('project_id', $filters['project_id']);
        }

        if (!empty($filters['date_start'])) {
            $column = $query->getModel() instanceof LeaveRequest ? 'start_date' : 'date';
            $query->where($column, '>=', $filters['date_start']);
        }

        if (!empty($filters['date_end'])) {
            $column = $query->getModel() instanceof LeaveRequest ? 'end_date' : 'date';
            $query->where($column, '<=', $filters['date_end']);
        }

        if (!empty($filters['type'])) {
            $column = $query->getModel() instanceof LeaveRequest ? 'leave_type_id' : 'time_type';
            $query->where($column, $filters['type']);
        }
    }
}
