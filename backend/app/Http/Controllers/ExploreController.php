<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Services\UserFilterService;
use Carbon\Carbon;


use Illuminate\Http\Request;

/*
    Handles user exploration functionality, such as filtering users based on preferences.
*/
class ExploreController extends Controller
{

    /*
        Retrieve a list of users based on filters and the authenticated user's preferences.

        Utilizes the UserFilterService to apply filtering logic.

        @param Request $request The incoming HTTP request containing filter parameters.
        @return JSON response containing the filtered user data.
    */
    public function index(Request $request)
    {
    $users = UserFilterService::filter($request, $request->user());
    return response()->json(['data' => $users]);
    }

}
