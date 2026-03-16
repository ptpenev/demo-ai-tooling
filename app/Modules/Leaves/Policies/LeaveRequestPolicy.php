<?php

namespace App\Modules\Leaves\Policies;

use App\Modules\Leaves\Models\LeaveRequest;
use App\Modules\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LeaveRequestPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->getPermissionScope('leaves.view') !== null;
    }

    public function view(User $user, LeaveRequest $request): bool
    {
        $scope = $user->getPermissionScope('leaves.view');

        if ($scope === 'all') {
            return true;
        }

        // Add team logic here if applicable
        
        return $request->user_id === $user->id;
    }

    public function approve(User $user, LeaveRequest $request): bool
    {
        $scope = $user->getPermissionScope('leave.approve');

        if ($scope === 'all') {
            return true;
        }

        if ($scope === 'team') {
            // Placeholder: Check if requester is in user's team
            return false; 
        }

        return false;
    }
}
