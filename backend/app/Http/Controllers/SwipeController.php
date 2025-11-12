<?php

namespace App\Http\Controllers;

use App\Models\Swipe;

use App\Models\UserMatch;
use App\Events\NewMatch;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\UserFilterService;


//  Handles user swipes (like/dislike) and fetching swipable users.
class SwipeController extends Controller
{
    /*
        Fetch a list of users available for swiping.

        @param Request $request
        @return JsonResponse
     */
    public function index(Request $request)
    {
    // Fetch filtered users for swiping (third parameter 'true' indicate swipable users)
    $users = UserFilterService::filter($request, $request->user(), true);
    return response()->json(['data' => $users]);
    }

    /*
        Handle a swipe action (like or dislike) from the authenticated user.

        @param Request $request
        @return JsonResponse
     */
    public function swipe(Request $request)
    {
        $request->validate([
            'to_user_id' => 'required|exists:users,id',
            'direction' => 'required|in:like,dislike',
        ]);

        $user = Auth::user();

        if ($user->id == $request->to_user_id) {
            return response()->json(['message' => 'Cannot swipe yourself'], 400);
        }
        $existing = Swipe::where('user_id', $user->id)
            ->where('to_user_id', $request->to_user_id)
            ->first();

        if($existing){
            return response()->json(['message' => 'Already swiped'], 409);
        }

        Swipe::create ([
            'user_id' => $user->id,
            'to_user_id' => $request->to_user_id,
            'direction' => $request->direction ,
        ]);

        $match = false;

        if($request->direction === 'like') {
            $reciprocated = Swipe::where('user_id', $request->to_user_id)
                ->where('to_user_id', $user->id)
                ->where('direction', true)
                ->exists();

            $match = $reciprocated;
            if($match){
                $userMatch = UserMatch::firstOrCreate(
                [
                    'user_one_id' => min($user->id, $request->to_user_id),
                    'user_two_id' => max($user->id, $request->to_user_id),
                ],
                [
                    'matched_at' => now()
                ]
                );
            broadcast(new NewMatch($userMatch, $request->to_user_id));
            }
        }
        return response()->json([
            'message' => 'Swipe saved',
            'match' => $match
        ]);
    }
}
