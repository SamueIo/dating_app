<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Conversation;

Broadcast::channel('chat.{conversationId}', function ($user, $roomId) {
        return $user && $user->conversation()->where('conversations.id', $roomId)->exists();
    });
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
        return (int) $user->id === (int) $id;
    });
Broadcast::channel('user-activity-all', function ($user) {
    return $user !== null;
});
Broadcast::channel('userMatch{recipientId}', function ($user, $recipientId) {
    return (int) $user->id === (int) $recipientId;
});


Broadcast::routes(['middleware' => [ 'web','auth:sanctum']]);


