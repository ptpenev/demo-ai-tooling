<?php

use App\Modules\Timesheets\Controllers\TimesheetController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('timesheets', TimesheetController::class);
});
