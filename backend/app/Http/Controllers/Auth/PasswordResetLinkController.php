<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use App\Services\BrevoMailService;
use Illuminate\Support\Facades\View;

class PasswordResetLinkController extends Controller
{
public function store(Request $request): JsonResponse
{
    $request->validate([
        'email' => ['required','email'],
    ]);

    $user = \App\Models\User::where('email', $request->email)->first();
    if (!$user) {
        throw ValidationException::withMessages([
            'email' => ['User not found.']
        ]);
    }

    $token = Password::createToken($user);
    $frontendUrl = config('app.frontend_url') . '/PasswordReset';
    $actionUrl = $frontendUrl . '?token=' . $token . '&email=' . urlencode($user->email);

    $htmlContent = view('vendor.notifications.email', [
        'user' => $user,
        'actionUrl' => $actionUrl
    ])->render();


    $brevo = new BrevoMailService();
    $sent = $brevo->sendMail(
        $user->email,
        'Reset your password',
        $htmlContent
    );

    if (! $sent) {
        return response()->json([
            'status' => 'error',
            'message' => 'Email could not be sent'
        ], 500);
    }

    return response()->json(['status' => 'Reset link sent.']);
}
}
