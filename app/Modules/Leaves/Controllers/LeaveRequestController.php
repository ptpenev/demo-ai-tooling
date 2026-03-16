<?php

namespace App\Modules\Leaves\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Audit\Services\Auditor;
use App\Modules\Leaves\Models\LeaveRequest;
use App\Modules\Leaves\Models\LeaveType;
use App\Modules\Leaves\Resources\LeaveRequestResource;
use App\Modules\Leaves\Services\LeaveBalanceService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LeaveRequestController extends Controller
{
    protected LeaveBalanceService $balanceService;
    protected Auditor $auditor;

    public function __construct(LeaveBalanceService $balanceService, Auditor $auditor)
    {
        $this->balanceService = $balanceService;
        $this->auditor = $auditor;
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $query = LeaveRequest::with(['type', 'user']);

        // Basic scoping: only own requests unless higher permission
        $scope = $user->getPermissionScope('leaves.view');
        
        if ($scope === 'all') {
            // No filter
        } elseif ($scope === 'team') {
            // Placeholder for team filter
            $query->where('user_id', $user->id);
        } else {
            $query->where('user_id', $user->id);
        }

        return LeaveRequestResource::collection($query->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'request_signature' => 'nullable|string',
        ]);

        $user = $request->user();
        $start = Carbon::parse($validated['start_date']);
        $end = Carbon::parse($validated['end_date']);
        
        // Prevent overlapping requests
        $overlap = LeaveRequest::where('user_id', $user->id)
            ->where(function($q) use ($start, $end) {
                $q->whereBetween('start_date', [$start, $end])
                  ->orWhereBetween('end_date', [$start, $end]);
            })
            ->exists();

        if ($overlap) {
            return response()->json(['message' => 'You already have a leave request during this period.'], 422);
        }

        $totalDays = $this->balanceService->calculateBusinessDays($start, $end);
        
        $leaveRequest = LeaveRequest::create(array_merge($validated, [
            'user_id' => $user->id,
            'total_days' => $totalDays,
            'status' => 'PENDING'
        ]));

        return new LeaveRequestResource($leaveRequest);
    }

    public function myBalance(Request $request)
    {
        $year = $request->get('year', now()->year);
        $remaining = $this->balanceService->getRemainingBalance($request->user()->id, $year);

        return response()->json([
            'year' => $year,
            'remaining_days' => $remaining
        ]);
    }

    public function approve(Request $request, LeaveRequest $leaveRequest)
    {
        $this->authorize('approve', $leaveRequest);

        $oldState = $leaveRequest->toArray();

        $leaveRequest->update([
            'status' => 'APPROVED',
            'approver_signature' => $request->get('comment'),
        ]);

        $this->balanceService->deductBalance($leaveRequest);

        $this->auditor->log('leave.approved', 'LeaveRequest', $leaveRequest->id, [
            'before' => $oldState,
            'after' => $leaveRequest->fresh()->toArray(),
        ]);

        return new LeaveRequestResource($leaveRequest);
    }

    public function reject(Request $request, LeaveRequest $leaveRequest)
    {
        $this->authorize('approve', $leaveRequest);

        $oldState = $leaveRequest->toArray();

        $leaveRequest->update([
            'status' => 'REJECTED',
            'approver_signature' => $request->get('comment'),
        ]);

        $this->auditor->log('leave.rejected', 'LeaveRequest', $leaveRequest->id, [
            'before' => $oldState,
            'after' => $leaveRequest->fresh()->toArray(),
        ]);

        return new LeaveRequestResource($leaveRequest);
    }
}
