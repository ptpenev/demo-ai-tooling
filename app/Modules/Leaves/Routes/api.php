<?php

use App\Modules\Leaves\Controllers\LeaveRequestController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/leaves/balance', [LeaveRequestController::class, 'myBalance'])->name('leaves.balance');
    Route::get('/leaves', [LeaveRequestController::class, 'index'])->name('leaves.index');
    Route::post('/leaves', [LeaveRequestController::class, 'store'])->name('leaves.store');
});
