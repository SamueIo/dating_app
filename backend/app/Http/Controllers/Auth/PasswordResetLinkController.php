<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use App\Notifications\BrevoResetPassword;

class PasswordResetLinkController extends Controller
{
    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
public function store(Request $request): JsonResponse
{
    $request->validate(['email' => ['required','email']]);

    $user = \App\Models\User::where('email', $request->email)->first();

    if (!$user) {
        throw ValidationException::withMessages([
            'email' => ['User not found.']
        ]);
    }

    $token = \Illuminate\Support\Facades\Password::createToken($user);

    try {
        $user->notify(new \App\Notifications\BrevoResetPassword($token));
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }

    return response()->json(['status' => 'Reset link sent.']);
}

}
