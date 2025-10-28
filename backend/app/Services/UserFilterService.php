<?php

namespace App\Services;

use App\Models\Swipe;
use App\Models\User;
use App\Models\BlockedUser;
use Carbon\Carbon;
use Illuminate\Http\Request;

class UserFilterService
{
    public static function filter(Request $request, $authUser, $excludeRated = false)
    {
        // Zablokovaní používatelia
        $blockedUserIds = BlockedUser::where('blocker_id', $authUser->id)->pluck('blocked_id')->toArray();
        $blockedByOthersIds = BlockedUser::where('blocked_id', $authUser->id)->pluck('blocker_id')->toArray();

        // Základný query
        $query = User::with(['profile', 'photos'])
            ->where('users.id', '!=', $authUser->id)
            ->whereNotIn('users.id', $blockedUserIds)
            ->whereNotIn('users.id', $blockedByOthersIds)
            ->whereHas('profile');

        // Gender filter
        if ($request->filled('gender')) {
            $query->whereHas('profile', function($q) use ($request) {
                $q->where('gender', $request->gender);
            });
        }

        // Exclude already rated users
        if ($excludeRated) {
            $ratedUserIds = Swipe::where('user_id', $authUser->id)
                ->pluck('to_user_id')
                ->toArray();

            if (!empty($ratedUserIds)) {
                $query->whereNotIn('users.id', $ratedUserIds);
            }
        }

        // Age filter
        if ($request->filled('ageFrom') || $request->filled('ageTo')) {
            $query->whereHas('profile', function($q) use ($request) {
                if ($request->filled('ageFrom')) {
                    $ageFromDate = Carbon::now()->subYears($request->ageFrom)->startOfDay();
                    $q->where('birth_date', '<=', $ageFromDate);
                }
                if ($request->filled('ageTo')) {
                    $ageToDate = Carbon::now()->subYears($request->ageTo + 1)->addDay()->endOfDay();
                    $q->where('birth_date', '>=', $ageToDate);
                }
            });
        }

        // Height filter
        if ($request->filled('heightFrom') || $request->filled('heightTo')) {
            $query->whereHas('profile', function ($q) use ($request) {
                if ($request->filled('heightFrom')) {
                    $q->where('height', '>=', $request->heightFrom);
                }
                if ($request->filled('heightTo')) {
                    $q->where('height', '<=', $request->heightTo);
                }
            });
        }

        // Only with photo filter
        if ($request->boolean('withPhoto')) {
            $query->whereHas('photos');
        }

        // Distance filter
        if ($request->filled('latitude') && $request->filled('longitude') && $request->filled('radiusKm')) {
            $lat = $request->latitude;
            $lon = $request->longitude;
            $distance = (float) $request->radiusKm;

            if ($distance > 0) {
                $query->join('profiles', 'profiles.user_id', '=', 'users.id')
                      ->whereNotNull('profiles.latitude')
                      ->whereNotNull('profiles.longitude')
                      ->select('users.*')
                      ->selectRaw("(
                          6371 * acos(
                              cos(radians(?)) * cos(radians(profiles.latitude)) *
                              cos(radians(profiles.longitude) - radians(?)) +
                              sin(radians(?)) * sin(radians(profiles.latitude))
                          )
                      ) AS distance", [$lat, $lon, $lat])
                      ->having('distance', '<=', $distance);
            }
        }
        // Ak nie sú súradnice alebo radius, **neaplikuje sa location filter** → zobrazia sa všetci

        // Offset a limit
        $offset = (int) $request->input('offset', 0);
        $limit = (int) $request->input('limit', 10);

        $users = $query->inRandomOrder()
            ->limit($limit)
            ->offset($offset)
            ->get();

        return $users;
    }
}
