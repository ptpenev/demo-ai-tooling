<?php

namespace App\Modules\Polls\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Polls\Events\PollUpdated;
use App\Modules\Polls\Models\Poll;
use App\Modules\Polls\Models\PollOption;
use App\Modules\Polls\Models\PollVote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PollController extends Controller
{
    /**
     * Get all polls.
     */
    public function index()
    {
        $polls = Poll::with(['options', 'votes'])->latest()->get();
        return response()->json($polls);
    }

    /**
     * Create a new poll.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'is_anonymous' => 'boolean',
            'result_visibility' => 'string|in:public,restricted',
            'deadline' => 'nullable|date',
            'options' => 'required|array|min:2',
            'options.*' => 'required|string',
        ]);

        $poll = Poll::create([
            'question' => $validated['question'],
            'is_anonymous' => $validated['is_anonymous'] ?? false,
            'result_visibility' => $validated['result_visibility'] ?? 'public',
            'deadline' => $validated['deadline'],
            'created_by' => Auth::id(),
        ]);

        foreach ($validated['options'] as $optionText) {
            $poll->options()->create(['text' => $optionText]);
        }

        return response()->json($poll->load('options'), 201);
    }

    /**
     * Cast a vote.
     */
    public function vote(Request $request, Poll $poll)
    {
        $validated = $request->validate([
            'poll_option_id' => 'required|exists:poll_options,id',
        ]);

        // Check if user already voted
        $existingVote = PollVote::where('poll_id', $poll->id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingVote) {
            return response()->json(['message' => 'You have already voted in this poll.'], 422);
        }

        // Check deadline
        if ($poll->deadline && now()->isAfter($poll->deadline)) {
            return response()->json(['message' => 'This poll has ended.'], 422);
        }

        $vote = PollVote::create([
            'poll_id' => $poll->id,
            'poll_option_id' => $validated['poll_option_id'],
            'user_id' => Auth::id(),
        ]);

        // Broadcast update for real-time results
        broadcast(new PollUpdated($poll))->toOthers();

        return response()->json($poll->load(['options', 'votes']), 201);
    }
}
