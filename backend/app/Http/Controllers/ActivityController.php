<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use App\Models\UserActivity;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Events\UserActivityUpdated;


use Illuminate\Http\Request;

/*
    class ActivityController

    Handles updating and retrieving activity  within conversation
 */
class ActivityController extends Controller
{
    /*
        Updating is_active nad last_active_at for the current logged user
        Broadcast UserActivityUpdated event

        @param Request $request containing:    is_active
        @return JSON response
    */
public function updateUserActivity(Request $request)
{
    try {
        $userId = Auth::id();

        $request->validate([
            'is_active' => 'required|boolean'
        ]);

        $userActivity = UserActivity::updateOrCreate(
            ['user_id' => $userId],
            [
                'last_active_at' => Carbon::now(),
                'is_active' => $request->is_active,
            ]
        );

        broadcast(new UserActivityUpdated($userActivity));

        return response()->json(['status' => 'success']);
    } catch (\Throwable $e) {


        return response()->json([
            'error' => true,
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ], 500);
    }
}

    /*
        Retrieve activity information for other users in conversations.
        Fetch all conversation for authenticated user a
        Get all participants activity for each user in conversations
        Determines if a participant is active if their `last_active_at` is within the last 2 minutes

        return [
            'user_id' : int,
            'name' : string,
            'last_active_at' : string|null,
            'is_active' :bool,
        ];
        @return Json response
    */
    public function getUserActivities()
    {
        $userId = Auth::id();


        $conversationIds = \DB::table('conversation_user')
            ->where('user_id', $userId)
            ->pluck('conversation_id')
            ->unique();

        $result = [];

        foreach ($conversationIds as $conversationId) {
            $otherUserIds = \DB::table('conversation_user')
                ->where('conversation_id', $conversationId)
                ->where('user_id', '!=', $userId)
                ->pluck('user_id')
                ->unique();

            $activities = UserActivity::with('user:id,name')
            ->whereIn('user_id', $otherUserIds)
            ->get()
            ->map(function ($activity) {
                $lastActive = optional($activity->last_active_at);
                $isActive = $lastActive && $lastActive->diffInMinutes(now()) <= 2;

                return [
                    'user_id' => $activity->user_id,
                    'name' => $activity->user->name ?? 'Neznámy používateľ',
                    'last_active_at' => $lastActive ? $lastActive->toDateTimeString() : null,
                    'is_active' => $isActive,
                ];
            });

            $result[] = [
                'conversation_id' => $conversationId,
                'participants' => $activities,
            ];
        }


        return response()->json($result);
    }



}
