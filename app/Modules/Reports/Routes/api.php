<?php

use App\Modules\Reports\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/reports/export-csv', [ReportController::class, 'exportCsv'])->name('reports.export-csv');
    Route::post('/reports/export-pdf', [ReportController::class, 'exportPdf'])->name('reports.export-pdf');
});
