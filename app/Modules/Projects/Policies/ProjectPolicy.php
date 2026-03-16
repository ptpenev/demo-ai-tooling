<?php

namespace App\Modules\Projects\Policies;

use App\Modules\Projects\Models\Project;
use App\Modules\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        $scope = $user->getPermissionScope('projects.view');

        if ($scope === 'all') {
            return true;
        }

        // For 'project', 'team', or 'own' - the controller index will filter results
        return in_array($scope, ['project', 'team', 'own']);
    }

    public function view(User $user, Project $project): bool
    {
        $scope = $user->getPermissionScope('projects.view');

        if ($scope === 'all') {
            return true;
        }

        if ($scope === 'project') {
            return $project->members()->where('user_id', $user->id)->exists();
        }

        // Add more logic for 'team' if teams are implemented, or 'own' if applicable
        return false;
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionWithScope('projects.create', 'all');
    }

    public function update(User $user, Project $project): bool
    {
        $scope = $user->getPermissionScope('projects.edit');

        if ($scope === 'all') {
            return true;
        }

        if ($scope === 'project') {
            // Only PM or Team Lead of this project can edit
            return $project->project_manager_id === $user->id || $project->team_lead_id === $user->id;
        }

        return false;
    }
}
