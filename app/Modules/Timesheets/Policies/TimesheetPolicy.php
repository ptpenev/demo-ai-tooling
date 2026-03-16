<?php

namespace App\Modules\Timesheets\Policies;

use App\Modules\Timesheets\Models\TimesheetEntry;
use App\Modules\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TimesheetPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->getPermissionScope('timesheets.view') !== null;
    }

    public function view(User $user, TimesheetEntry $entry): bool
    {
        $scope = $user->getPermissionScope('timesheets.view');

        if ($scope === 'all') {
            return true;
        }

        if ($scope === 'project') {
            return $user->projects()->where('project_id', $entry->project_id)->exists();
        }

        if ($scope === 'team') {
            // Placeholder for team logic
            return $entry->user_id === $user->id;
        }

        return $entry->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->getPermissionScope('timesheets.create') !== null;
    }

    public function update(User $user, TimesheetEntry $entry): bool
    {
        $scope = $user->getPermissionScope('timesheets.edit');

        if ($scope === 'all') {
            return true;
        }

        if ($scope === 'project') {
            // Allow PM/TeamLead to edit?
            // For now, only owner can edit unless scope is all
            return $entry->user_id === $user->id;
        }

        return $entry->user_id === $user->id;
    }

    public function approve(User $user, TimesheetEntry $entry): bool
    {
        $scope = $user->getPermissionScope('timesheets.approve');

        if ($scope === 'all') {
            return true;
        }

        if ($scope === 'project') {
            // User must be a Project Manager or Team Lead of this project
            return $user->projects()
                ->where('project_id', $entry->project_id)
                ->whereIn('role', ['PM', 'Team Lead'])
                ->exists();
        }

        if ($scope === 'team') {
            // Placeholder for team lead logic
            return false;
        }

        return false;
    }
}
