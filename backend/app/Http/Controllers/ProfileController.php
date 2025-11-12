<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;


//  Handles fetching and updating user profile data.

class ProfileController extends Controller
{
    /*
        Get the authenticated user's profile along with photos.

        @return JSON response
    */
    public function getProfile()
    {
        $user = Auth::user();
        $profile = $user->profile;
        $photos = $user->photos;


        if (!$profile) {
            return response()->json([
                'message' => 'No profile'
            ], 404);
        }
        $data = [
            'name' => $user->name,
            'profile' => $profile,
            'photos' => $photos
        ];

        return response()->json($data);
    }


    /*
        Update the authenticated user's profile.

        If the user does not have a profile, a new profile is created.

        @param Request $request
        @return JSON response
     */
    public function updateProfile(Request $request)
    {
        $profile = Auth::user()->profile;
        $user = Auth::user();



        $validated = $request->validate([
            'birth_date' => 'nullable|string|max:255',
            'gender' => 'nullable|string|max:255',
            'interested_in' => 'nullable|string|max:255',
            'relationship_type' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'height' => 'nullable|integer|min:0|max:300',
            'education' => 'nullable|string|max:255',
            'job_title' => 'nullable|string|max:255',
            'smoking' => 'nullable|in:yes,no,neutral,hate',
            'drinking' => 'nullable|in:yes,no,neutral,hate',
            'pets' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);
        if($profile){
            $profile->update($validated);
        }else{
            $profile = $user->profile()->create($validated);
        }

        return response()->json([
            'message' => 'Profil bol aktualizovaný.',
            'profile' => $profile
        ]);
    }
}
