<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Services\UserFilterService;
use Carbon\Carbon;


use Illuminate\Http\Request;

class ExploreController extends Controller
{
    public function index(Request $request)
    {
    $users = UserFilterService::filter($request, $request->user());
    return response()->json(['data' => $users]);
    }

}
