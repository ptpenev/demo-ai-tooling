<?php

namespace App\Modules\Reports\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Reports\Jobs\ExportTimesheetsCsv;
use App\Modules\Reports\Jobs\ExportTimesheetsPdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    /**
     * Dispatch a CSV export job.
     */
    public function exportCsv(Request $request)
    {
        ExportTimesheetsCsv::dispatch(
            $request->only(['user_id', 'project_id', 'date_start', 'date_end', 'type']),
            Auth::id()
        );

        return response()->json(['message' => 'CSV export job dispatched successfully.']);
    }

    /**
     * Dispatch a PDF export job.
     */
    public function exportPdf(Request $request)
    {
        ExportTimesheetsPdf::dispatch(
            $request->only(['user_id', 'project_id', 'date_start', 'date_end', 'type']),
            Auth::id()
        );

        return response()->json(['message' => 'PDF export job dispatched successfully.']);
    }
}
