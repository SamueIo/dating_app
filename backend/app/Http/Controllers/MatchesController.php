<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;

use App\Models\UserMatch;
use App\Models\BlockedUser;

class MatchesController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Získaj ID všetkých používateľov, ktorí sú buď tebou bloknutí, alebo ťa blokli
        $blockedUserIds = BlockedUser::where('blocker_id', $user->id)->pluck('blocked_id')->toArray();
        $blockedByOthersIds = BlockedUser::where('blocked_id', $user->id)->pluck('blocker_id')->toArray();

        // Spoj a odstráň duplikáty
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

                // Odstrániť zápasy, kde je druhý používateľ blokovaný alebo ťa blokuje
                return !in_array($otherUserId, $allBlockedIds);
            })
            ->values(); // Resetne indexy (dôležité pre správny JSON výstup)

        // Naformátuj výstup
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
