<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;

Route::get('/', function () {
    return auth()->check() ? view('dashboard') : view('welcome');
});

Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Authenticated routes
Route::middleware(['auth'])->group(function () {
    Route::get('/calendar', function () { return view('calendar.index'); });
    Route::get('/projects', function () { return view('projects.index'); });
    Route::get('/projects/create', function () { return view('projects.create'); });
    Route::get('/leaves', function () { return view('leaves.index'); });
    Route::get('/leaves/create', function () { return view('leaves.create'); });
    Route::get('/timesheets', function () { return view('timesheets.index'); });
    Route::get('/timesheets/create', function () { return view('timesheets.create'); });
    Route::get('/reports', function () { return view('reports.index'); });
    Route::get('/announcements', function () { return view('announcements.index'); });
});
