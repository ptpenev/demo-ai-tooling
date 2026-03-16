<?php

namespace App\Modules\Reports\Jobs;

use App\Modules\Reports\Services\ReportingService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ExportTimesheetsPdf implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected array $filters;
    protected int $userId;

    /**
     * Create a new job instance.
     */
    public function __construct(array $filters, int $userId)
    {
        $this->filters = $filters;
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     */
    public function handle(ReportingService $service): void
    {
        $data = $service->getFilteredTimesheets($this->filters);

        $filename = "exports/timesheets_" . now()->format('Ymd_His') . ".pdf";
        
        // Mocking PDF generation (in real app, use DomPDF to render a view)
        $content = "PDF CONTENT PLACEHOLDER for " . count($data) . " entries";

        Storage::disk('public')->put($filename, $content);

        // In a real app, notify user here
    }
}
