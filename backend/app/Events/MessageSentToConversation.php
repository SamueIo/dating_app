<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSentToConversation implements ShouldBroadcastNow

{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $roomId;
    public $tempId;

    public function __construct($message, $roomId, $tempId = null)
    {
        $this->message = $message;
        $this->roomId = $roomId;
        $this->tempId = $tempId;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat.' . $this->roomId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    public function broadcastWith(): array
    {
        return [
            'message' => $this->message,
            'room_id' => $this->roomId,
            'temp_id' => $this->tempId,
        ];
    }
}
