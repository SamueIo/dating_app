<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;


class MessageSeen implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $conversationId;
    public $seenByUserId;
    public $msgIds;
    public function __construct($conversationId, $seenByUserId, $msgIds = [])
    {
        $this->conversationId = $conversationId;
        $this->seenByUserId = $seenByUserId;
        $this->msgIds = $msgIds;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("chat.{$this->conversationId}"),
        ];
    }
    public function broadcastWith()
    {
        return [
            'conversation_id' => $this->conversationId,
            'seenByUserId' => $this->seenByUserId,
            'msgIds' => $this->msgIds,
        ];
    }
    public function broadcastAs()
    {
        return 'message.seen';
    }
}
