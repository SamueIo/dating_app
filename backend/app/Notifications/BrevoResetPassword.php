<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class BrevoResetPassword extends Notification
{
    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    // Kanály notifikácie
    public function via($notifiable)
    {
        return ['mail']; // alebo ['smtp'], ak explicitne
    }

    // Táto metóda MUSÍ existovať pre mail kanál
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Reset your password')
            ->line('You requested a password reset link.')
            ->action('Reset Password', url('/reset-password/'.$this->token))
            ->line('If you did not request this, no further action is required.');
    }
}
