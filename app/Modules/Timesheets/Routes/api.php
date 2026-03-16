<?php

use App\Modules\Timesheets\Controllers\TimesheetController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('timesheets/{timesheet}/approve', [TimesheetController::class, 'approve'])->name('timesheets.approve');
    Route::post('timesheets/{timesheet}/reject', [TimesheetController::class, 'reject'])->name('timesheets.reject');
    Route::apiResource('timesheets', TimesheetController::class);
});
