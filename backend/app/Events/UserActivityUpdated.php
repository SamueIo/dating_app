<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\UserActivity;
class UserActivityUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $userActivity;
    public $last_active_at;
    public $is_active;
    /**
     * Create a new event instance.
     */
    public function __construct(UserActivity $userActivity)
    {
        $this->userActivity = $userActivity;

    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user-activity-all'),
        ];
    }

    public function broadcastAs()
    {
        return 'UserActivityUpdated';
    }
    public function broadcastWith()
    {
        return [
            'user_id' => $this->userActivity->user_id,
            'last_active_at' => $this->userActivity->last_active_at->toDateTimeString(),
            'is_active' => $this->userActivity->is_active,
        ];
    }
}
