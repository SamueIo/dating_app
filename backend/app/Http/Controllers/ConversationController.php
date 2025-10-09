<?php

namespace App\Http\Controllers;
use App\Models\Conversation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Events\MessageSentToConversation;
use App\Events\MessageSentToUser;
use App\Models\BlockedUser;
use App\Events\MessageSeen;
use Illuminate\Support\Facades\Log;


class ConversationController extends Controller
{
    public function showConversations(Request $request){
        $user = Auth::user();

        $blockedUserIds = BlockedUser::where('blocker_id', $user->id)->pluck('blocked_id')->toArray();
        $blockedByOthersIds = BlockedUser::where('blocked_id', $user->id)->pluck('blocker_id')->toArray();


        $conversations = $user->conversation()
            ->with(['lastMessage.user', 'lastMessage.attachments', 'users'])
            ->whereHas('users', function ($query) use ($user, $blockedUserIds, $blockedByOthersIds) {
                $query->where('users.id', '!=', $user->id)
                      ->whereNotIn('users.id', $blockedUserIds)
                      ->whereNotIn('users.id', $blockedByOthersIds);
            })
            ->orderByDesc(
                \DB::table('messages')
                ->select('created_at')
                ->whereColumn('conversation_id', 'conversations.id')
                ->orderByDesc('created_at')
                ->limit(1)
            )
            ->get();

        $formatted = $conversations->map(function ($conversations) use ($user){
        $otherUser = $conversations->users->firstWhere('id', '!=', $user->id);

            return [
                'id' => $conversations->id,
                'other_user' => [
                    'id' => $otherUser->id,
                    'name' => $otherUser->name,
                    'main_photo' => $otherUser->mainPhoto()->first()
                ],
                'last_message' => $conversations->lastMessage
            ] ;
        });
        return response()->json($formatted);
    }

    public function showConversationById($id) {
    $user = Auth::user();

    $conversation = $user->conversation()
        ->where('conversations.id', $id)
        ->with(['lastMessage.user', 'lastMessage.attachments', 'users'])
        ->first();

    if (!$conversation) {
        return response()->json(['message' => 'Conversation not found'], 404);
    }

    $otherUser = $conversation->users->firstWhere('conversations.id', '!=', $user->id);

    return response()->json([
        'id' => $conversation->id,
        'other_user' => [
            'id' => $otherUser->id,
            'name' => $otherUser->name,
            'main_photo' => $otherUser->mainPhoto()->first()
        ],
        'last_message' => $conversation->lastMessage,
    ]);
    }

    public function createConversation(Request $request)
    {
        $user = Auth::user();
        $authUserId = $user->id;
        $otherUserId = $request->input('user_id');

        if($authUserId == $otherUserId) {
            return response()->json(['error' => 'Invalid  user ID'], 422);
        }
         $conversation = Conversation::whereHas('users', fn($q) => $q->where('user_id', $authUserId))
        ->whereHas('users', fn($q) => $q->where('user_id', $otherUserId))
        ->first();

        if(!$conversation){
            $conversation = Conversation::create();
            $conversation->users()->attach([$authUserId, $otherUserId]);
        }
        return response()->json($conversation);
    }

    public function storeMessages(Request $request)
    {
        $tempId  = $request->input('temp_id');
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'body' => 'nullable|string',
            'attachments.*' => 'file|max:10240'
        ]);
        $message = Message::create([
            'conversation_id' => $request->conversation_id,
            'user_id' => auth()->id(),
            'body' => $request->body,
            'seen' => false,
        ]);

        // Message attachments if exists
        if($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file){
                $mime = $file->getMimeType();
                $type = str_contains($mime, 'image') ? 'image'
                   : (str_contains($mime, 'video') ? 'video'
                   : (str_contains($mime, 'audio') ? 'audio' : 'file'));

                $path = $file->store('attachments', 'public');

                $message->attachments()->create([
                    'type' => $type,
                    'mime_type' => $mime,
                    'url' => $path,
                ]);
            }
        }



        $roomId = $request->conversation_id;

        $conversation =Conversation::with('users')->findOrFail($roomId);
        $recipient = $conversation->users->firstWhere('id', '!=', auth()->id());
        $message->load('attachments');

        broadcast(new MessageSentToConversation($message, $roomId, $tempId))->toOthers();

        if($recipient) {
            broadcast(new MessageSentToUser($message, $recipient->id));
        }

        return response()->json($message, 201);
    }


public function getMessages(Request $request, $conversationId)
{
    $limit = $request->input('limit', 20);
    $offset = $request->input('offset', 0);

    // Načítaj správy spolu s prílohami
    $messages = Message::with('attachments')
        ->where('conversation_id', $conversationId)
        ->orderBy('created_at', 'desc')
        ->skip($offset)
        ->take($limit)
        ->get();

    // Pridáme dynamické vlastnosti k správam a naformátujeme čas
    $messages->transform(function ($message) {
        // Pridáme flag, či správa obsahuje prílohy
        $message->isAttachment = $message->attachments->isNotEmpty();

        // Typ prílohy (voliteľné)
        $message->attachmentType = $message->attachments->isNotEmpty()
            ? $message->attachments->first()->type
            : null;

        // Naformátujeme created_at do ISO 8601
        $message->created_at = $message->created_at->toIso8601String();

        return $message;
    });
    $messages = $messages->reverse()->values();

    return response()->json($messages);
}

    public function markAsSeen( $conversationId){
        $userId = auth()->id();

        $messageToUpdate = Message::where('conversation_id', $conversationId)
            ->where('user_id', '!=', $userId)
            ->where('seen' , false)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $allMessages = Message::where('conversation_id', $conversationId)->get();
        if ($messageToUpdate->isNotEmpty()) {
            Message::whereIn('id', $messageToUpdate->pluck('id'))->update(['seen' => true]);
        }
        Broadcast(new MessageSeen(
            $conversationId,
            $userId,
            $messageToUpdate->pluck('id')->toArray()
        ))->toOthers();

        return response()->json(['message' => 'Messages marked as seen']);
    }

    public function blockUser( $id ){

    }


}
