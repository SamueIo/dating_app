<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BrevoResetPassword extends Notification
{
    use Queueable;

    public $token;
    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['brevo'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toBrevo($notifiable)
    {
        $brevo = new BrevoMailService();

        $url = url("/reset-password/{$this->token}?email=" . $notifiable->email);

        $brevo->sendEmail(
            $notifiable->email,
            $notifiable->name ?? 'User',
            'Reset your password',
            "<p>Kliknite na odkaz pre reset hesla: <a href='{$url}'>Resetovať heslo</a></p>"
        );
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
