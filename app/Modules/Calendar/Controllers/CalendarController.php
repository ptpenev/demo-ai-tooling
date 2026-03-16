<?php

namespace App\Modules\Calendar\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Timesheets\Models\TimesheetEntry;
use App\Modules\Leaves\Models\LeaveRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CalendarController extends Controller
{
    /**
     * Get aggregated events for the calendar.
     */
    public function events(Request $request)
    {
        $user = $request->user();
        $start = Carbon::parse($request->get('start', now()->startOfMonth()));
        $end = Carbon::parse($request->get('end', now()->endOfMonth()));

        $events = collect();

        // 1. Add Timesheet Entries
        $timesheets = TimesheetEntry::with('project')
            ->where('user_id', $user->id)
            ->whereBetween('date', [$start, $end])
            ->get();

        foreach ($timesheets as $ts) {
            $events->push([
                'id' => "ts-{$ts->id}",
                'title' => "{$ts->hours}h: {$ts->project->name}",
                'start' => $ts->date->toDateString(),
                'allDay' => true,
                'type' => 'timesheet',
                'color' => '#3b82f6', // blue-500
            ]);
        }

        // 2. Add Approved Leave Requests
        $leaves = LeaveRequest::with('type')
            ->where('user_id', $user->id)
            ->where('status', 'APPROVED')
            ->where(function($q) use ($start, $end) {
                $q->whereBetween('start_date', [$start, $end])
                  ->orWhereBetween('end_date', [$start, $end]);
            })
            ->get();

        foreach ($leaves as $leave) {
            $events->push([
                'id' => "leave-{$leave->id}",
                'title' => "Leave: {$leave->type->name}",
                'start' => $leave->start_date->toDateString(),
                'end' => $leave->end_date->addDay()->toDateString(), // FullCalendar ends are exclusive
                'allDay' => true,
                'type' => 'leave',
                'color' => '#10b981', // emerald-500
            ]);
        }

        // 3. Add Mock Holidays (as specified)
        // In a real app, this might come from a DB table
        $holidays = [
            ['title' => 'New Year', 'date' => '2026-01-01'],
            ['title' => 'Christmas', 'date' => '2026-12-25'],
        ];

        foreach ($holidays as $holiday) {
            $holidayDate = Carbon::parse($holiday['date']);
            if ($holidayDate->between($start, $end)) {
                $events->push([
                    'id' => "holiday-{$holiday['date']}",
                    'title' => "Holiday: {$holiday['title']}",
                    'start' => $holiday['date'],
                    'allDay' => true,
                    'type' => 'holiday',
                    'color' => '#f43f5e', // rose-500
                ]);
            }
        }

        return response()->json($events);
    }
}
