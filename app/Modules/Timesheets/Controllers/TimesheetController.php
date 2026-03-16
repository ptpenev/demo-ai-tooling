<?php

namespace App\Modules\Timesheets\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Timesheets\Models\TimesheetEntry;
use App\Modules\Timesheets\Requests\TimesheetRequest;
use App\Modules\Timesheets\Resources\TimesheetResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TimesheetController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $scope = $user->getPermissionScope('timesheets.view');

        $query = TimesheetEntry::with(['project', 'user']);

        if ($scope === 'project') {
            $query->whereIn('project_id', $user->projects()->pluck('projects.id'));
        } elseif ($scope === 'team') {
            // Placeholder for team filtering
            $query->where('user_id', $user->id);
        } elseif ($scope === 'own') {
            $query->where('user_id', $user->id);
        }
        
        // Optional filters
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->has('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        return TimesheetResource::collection($query->get());
    }

    public function store(TimesheetRequest $request): TimesheetResource
    {
        $user = $request->user();
        $scope = $user->getPermissionScope('timesheets.create');

        // If scope is project, user must belong to the project
        if ($scope === 'project') {
            $isMember = $user->projects()->where('projects.id', $request->project_id)->exists();
            if (!$isMember) {
                abort(403, 'You are not a member of this project.');
            }
        }

        $entry = TimesheetEntry::create(array_merge(
            $request->validated(),
            ['user_id' => $user->id]
        ));

        return new TimesheetResource($entry);
    }

    public function show(TimesheetEntry $timesheet): TimesheetResource
    {
        $this->authorize('view', $timesheet);
        $timesheet->load(['project', 'user']);
        return new TimesheetResource($timesheet);
    }

    public function update(TimesheetRequest $request, TimesheetEntry $timesheet): TimesheetResource
    {
        $this->authorize('update', $timesheet);
        
        $timesheet->update($request->validated());

        return new TimesheetResource($timesheet);
    }

    public function destroy(TimesheetEntry $timesheet)
    {
        $this->authorize('delete', $timesheet);
        $timesheet->delete();
        return response()->noContent();
    }

    public function approve(Request $request, TimesheetEntry $timesheet): TimesheetResource
    {
        $this->authorize('approve', $timesheet);

        $timesheet->update([
            'status' => 'APPROVED',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return new TimesheetResource($timesheet);
    }

    public function reject(Request $request, TimesheetEntry $timesheet): TimesheetResource
    {
        $this->authorize('approve', $timesheet);

        $timesheet->update([
            'status' => 'REJECTED',
        ]);

        return new TimesheetResource($timesheet);
    }
}
