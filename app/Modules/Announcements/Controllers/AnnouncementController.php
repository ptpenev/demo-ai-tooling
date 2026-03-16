<?php

namespace App\Modules\Announcements\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Announcements\Models\Announcement;
use App\Modules\Announcements\Models\AnnouncementTarget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends Controller
{
    /**
     * Get announcements for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $now = now();

        $query = Announcement::with('creator')
            ->where(function ($q) use ($now) {
                $q->whereNull('valid_from')->orWhere('valid_from', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('valid_until')->orWhere('valid_until', '>=', $now);
            });

        // Filter by targets
        $query->whereHas('targets', function ($q) use ($user) {
            $q->where('target_type', 'all')
              ->orWhere(function ($sq) use ($user) {
                  $sq->where('target_type', 'user')->where('target_id', $user->id);
              })
              ->orWhere(function ($sq) use ($user) {
                  $sq->where('target_type', 'team'); // Placeholder for team targeting
              })
              ->orWhere(function ($sq) use ($user) {
                  $sq->where('target_type', 'project')
                    ->whereIn('target_id', $user->projects()->pluck('projects.id'));
              });
        });

        return response()->json($query->latest()->get());
    }

    /**
     * Create a new announcement.
     */
    public function store(Request $request)
    {
        // Permission check: only admin/super-admin can create announcements
        // $this->authorize('announcements.create');

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
            'targets' => 'required|array',
            'targets.*.target_type' => 'required|string|in:all,team,project,user',
            'targets.*.target_id' => 'nullable|numeric',
        ]);

        $announcement = Announcement::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'valid_from' => $validated['valid_from'] ?? now(),
            'valid_until' => $validated['valid_until'],
            'created_by' => Auth::id(),
        ]);

        foreach ($validated['targets'] as $target) {
            $announcement->targets()->create($target);
        }

        return response()->json($announcement->load('targets'), 201);
    }
}
