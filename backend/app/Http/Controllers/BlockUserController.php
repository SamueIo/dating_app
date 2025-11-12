<?php

namespace App\Http\Controllers;
use App\Models\BLockedUser;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;


// Handles blocking and unblocking users as well as retrieving the blocked users list.
class BlockUserController extends Controller
{

    /*
        Add specific user to authentificated user's blocked list

        @param int $id The id of user to block
        @return JSON with message
    */
    public function blockUser($id)
    {
        $userId = Auth::id();

        if($userId == $id){
            return response()->json(['error' => 'You cannot block yourself'], 400);
        }

        $block = BLockedUser::firstOrCreate([
            'blocker_id' => $userId,
            'blocked_id' => $id,
        ]);

        return response()->json(['message' => 'User blocked'], 200);
    }

    /*
        Unblock specific user from authenticated user's blocked list

        @param int $id ID of user to unblock
        @return JSON with message
    */
    public function unblock($id)
    {
        $userId = Auth::id();

        $deleted = BlockedUser::where('blocker_id', $userId)
                                ->where('blocked_id', $id)
                                ->delete();

        if($deleted){
            return response()->json(['message' => 'User unblocked']);
        }

        return response()->json(['message' => 'No block found'], 404);

    }

    /*
        Get the list of blocked users

        Return blocked list of authenticated user

        @return JSON with array if blocked users
    */
    public function blockedList()
    {
        $userId = Auth::id();

        $blockedUsers = BlockedUser::with('blocked.mainPhoto')
            ->where('blocker_id', $userId)
            ->get()
            ->map(function ($blockedUser) {
                return $blockedUser->blocked;
            });

        return response()->json($blockedUsers);
    }


}
