<?php

use App\Modules\Calendar\Controllers\CalendarController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/calendar/events', [CalendarController::class, 'events'])->name('calendar.events');
});
