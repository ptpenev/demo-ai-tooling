<?php

namespace App\Modules\Users\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Users\Models\User;
use App\Modules\Users\Requests\UpdateProfileRequest;
use App\Modules\Users\Resources\UserProfileResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserProfileController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(User $user): UserProfileResource
    {
        return new UserProfileResource($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProfileRequest $request, User $user): UserProfileResource
    {
        // For profile updates, we might want to ensure the user is updating their own profile
        // unless they have admin permissions. This will be handled by policies later.
        $user->update($request->validated());

        return new UserProfileResource($user);
    }
}
