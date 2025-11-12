<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use App\Models\UserFilter;
use Illuminate\Http\Request;


/*
    Handles CRUD operations for user search filters.
*/
class FilterController extends Controller
{

    /*
        Store or update the authenticated user's search filter settings

        Validates incoming filter parameters and saves them in the database.

        @param Request $request The HTTP request containing filter data.
        @return \Illuminate\Http\JsonResponse JSON response containing a success message and the saved filter data.

        @bodyParam gender string|null "Gender filter" Example: "male"
        @bodyParam ageFrom int|null "Minimum age" Example: 18
        @bodyParam ageTo int|null "Maximum age" Example: 35
        @bodyParam location string|null "Location name" Example: "New York"
        @bodyParam heightFrom int|null "Minimum height in cm" Example: 160
        @bodyParam heightTo int|null "Maximum height in cm" Example: 190
        @bodyParam onlyOnline boolean "Filter for online users only" Example: true
        @bodyParam withPhoto boolean "Filter users with profile photo" Example: true
        @bodyParam latitude float|null "Latitude for distance filter" Example: 40.7128
        @bodyParam longitude float|null "Longitude for distance filter" Example: -74.0060
        @bodyParam distance int|null "Distance in km" Example: 10
        @bodyParam radiusKm int|null "Radius in km for geolocation filter" Example: 5
    */
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


    /*
        Retrieve the authenticated user's search filter settings.

        @param Request $request The HTTP request.
        @return JSON response containing the filter data.
    */
    public function show(Request $request)
    {
        $user = $request->user();
        $filter =$user->filter;

        return response()->json(['data' => $filter]);
    }

}
