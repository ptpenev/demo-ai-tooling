<?php

use App\Modules\Users\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile/{user}', [UserProfileController::class, 'show'])->name('profile.show');
    Route::patch('/profile/{user}', [UserProfileController::class, 'update'])->name('profile.update');
});
