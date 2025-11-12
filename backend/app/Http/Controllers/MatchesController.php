<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;

use App\Models\UserMatch;
use App\Models\BlockedUser;


/*
    Handles retrieval of user matches while respecting block rules.
*/
class MatchesController extends Controller
{

    /*
        Get a list of matched users for the authenticated user.

        Filters out users who are blocked by or have blocked the authenticated user.

        @return JSON response containing an array of matched users with their basic info.

    */
    public function index()
    {
        $user = Auth::user();

        // Get IDs of users who are blocked or blocked the authenticated user
        $blockedUserIds = BlockedUser::where('blocker_id', $user->id)->pluck('blocked_id')->toArray();
        $blockedByOthersIds = BlockedUser::where('blocked_id', $user->id)->pluck('blocker_id')->toArray();

        $allBlockedIds = array_unique(array_merge($blockedUserIds, $blockedByOthersIds));

        $matches = UserMatch::where(function ($query) use ($user) {
                $query->where('user_one_id', $user->id)
                      ->orWhere('user_two_id', $user->id);
            })
            ->with(['userOne.mainPhoto', 'userTwo.mainPhoto'])
            ->orderBy('updated_at', 'desc')
            ->get()
            ->filter(function ($match) use ($user, $allBlockedIds) {
                $otherUserId = $match->user_one_id === $user->id
                    ? $match->user_two_id
                    : $match->user_one_id;

                    // Exclude blocked users
                return !in_array($otherUserId, $allBlockedIds);
            })
            ->values();

        $matchedUsers = $matches->map(function ($match) use ($user) {
            $otherUser = $match->user_one_id === $user->id
                ? $match->userTwo
                : $match->userOne;

            return [
                'id' => $otherUser->id,
                'name' => $otherUser->name,
                'main_photo' => $otherUser->mainPhoto,
                'matched_at' => $match->formatted_matched_at,
            ];
        });

        return response()->json($matchedUsers);
    }
}
