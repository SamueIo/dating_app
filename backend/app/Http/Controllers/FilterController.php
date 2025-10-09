<?php

namespace App\Http\Controllers;

use App\Models\UserFilter;
use Illuminate\Http\Request;

class FilterController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'gender' => 'nullable|in:male,female',
            'ageFrom' => 'nullable|integer|min:13',
            'ageTo' => 'nullable|integer|min:13',
            'location' => 'nullable|string|max:255',
            'heightFrom' => 'nullable|integer|min:0',
            'heightTo' => 'nullable|integer|min:0',
            'onlyOnline' => 'boolean',
            'withPhoto' => 'boolean',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'distance' => 'nullable|integer|min:0',
            'radiusKm' => 'nullable|integer|min:0',
        ]);

        $data = [
            'gender' => $validated['gender'] ?? null,
            'age_from' => $validated['ageFrom'] ?? null,
            'age_to' => $validated['ageTo'] ?? null,
            'location' => $validated['location'] ?? null,
            'height_from' => $validated['heightFrom'] ?? null,
            'height_to' => $validated['heightTo'] ?? null,
            'only_online' => $validated['onlyOnline'] ?? false,
            'with_photo' => $validated['withPhoto'] ?? false,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'distance' => $validated['distance'] ?? 10,
            'radius_km' => $validated['radiusKm'] ?? 0,
        ];

        $filter = UserFilter::updateOrCreate(
            ['user_id' => $user->id],
            $data
        );
        return response()->json(['message' => 'Filter saved', 'data' => $filter]);
    }

    public function show(Request $request)
    {
        $user = $request->user();
        $filter =$user->filter;

        return response()->json(['data' => $filter]);
    }

}
