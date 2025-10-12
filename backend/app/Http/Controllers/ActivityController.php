<?php

namespace App\Http\Controllers;
use App\Models\UserActivity;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Events\UserActivityUpdated;


use Illuminate\Http\Request;

class ActivityController extends Controller
{
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
    public function getUserActivities()
    {
        $userId = Auth::id();


        // Získaj všetky konverzácie, kde si účastníkom
        $conversationIds = \DB::table('conversation_user')
            ->where('user_id', $userId)
            ->pluck('conversation_id')
            ->unique();

        $result = [];

        foreach ($conversationIds as $conversationId) {
            // Získaj všetkých používateľov konverzácie okrem seba
            $otherUserIds = \DB::table('conversation_user')
                ->where('conversation_id', $conversationId)
                ->where('user_id', '!=', $userId) // <--- vylúči seba
                ->pluck('user_id')
                ->unique();

            // Načítať aktivity len iných používateľov
            $activities = UserActivity::with('user:id,name')
                ->whereIn('user_id', $otherUserIds)
                ->get()
                ->map(function ($activity) {
                    return [
                        'user_id' => $activity->user_id,
                        'name' => $activity->user->name ?? 'Neznámy používateľ',
                        'last_active_at' => optional($activity->last_active_at)->toDateTimeString(),
                        'is_active' => $activity->is_active,
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
