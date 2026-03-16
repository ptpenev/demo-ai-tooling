<?php

namespace App\Modules\Reports\Jobs;

use App\Modules\Reports\Services\ReportingService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ExportTimesheetsCsv implements ShouldQueue
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

        $filename = "exports/timesheets_" . now()->format('Ymd_His') . ".csv";
        
        // Mocking CSV generation
        $content = "Date,Employee,Project,Hours,Type,Comment\n";
        foreach ($data as $row) {
            $content .= "{$row->date->format('Y-m-d')},{$row->user->first_name} {$row->user->last_name},{$row->project->name},{$row->hours},{$row->time_type},\"{$row->comment}\"\n";
        }

        Storage::disk('public')->put($filename, $content);

        // In a real app, we would notify the user here via an event/notification
    }
}
