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

    // public function sendToBrevo($user)
    // {
    //     $service = new BrevoMailService();
    //     $service->sendMail(
    //         $user->email,
    //         'Reset your password',
    //         "<p>Click <a href='" . url('/reset-password/'.$this->token) . "'>here</a> to reset your password.</p>"
    //     );
    // }


    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Reset your password')
            ->markdown('vendor.notifications.email', [
                'token' => $this->token,
                'user' => $notifiable,
            ]);
    }
}
