<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use App\Services\BrevoMailService;

class BrevoResetPassword extends Notification
{
    protected $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail']; // Tento kód sa vôbec nepoužíva na kanály Mail
    }

    public function sendToBrevo($user)
    {
        $service = new BrevoMailService();

        $frontendUrl = config('app.frontend_url') ?? 'https://matchlove.projectbrand.cloud';
        $resetLink = "{$frontendUrl}/password-reset/{$this->token}?email=" . urlencode($user->email);

        $service->sendMail(
            $user->email,
            'Reset your password',
            "<p>Click <a href='{$resetLink}'>here</a> to reset your password.</p>"
        );
    }



}
