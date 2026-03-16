<?php

namespace App\Modules\Polls\Events;

use App\Modules\Polls\Models\Poll;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PollUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Poll $poll;

    /**
     * Create a new event instance.
     */
    public function __construct(Poll $poll)
    {
        $this->poll = $poll->load(['options', 'votes']);
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('polls'),
        ];
    }
}
