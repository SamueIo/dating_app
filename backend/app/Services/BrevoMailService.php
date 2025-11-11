<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class BrevoMailService
{
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = env('BREVO_API_KEY');
    }

    public function sendMail(string $to, string $subject, string $htmlBody, string $from = null, string $fromName = null): bool
    {

        $from = $from ?? env('MAIL_FROM_ADDRESS');
        $fromName = $fromName ?? env('MAIL_FROM_NAME');

        $response = Http::withHeaders([
            'api-key' => $this->apiKey,
            'Accept' => 'application/json',
        ])->post('https://api.brevo.com/v3/smtp/email', [
            'sender' => [
                'name' => $fromName,
                'email' => $from,
            ],
            'to' => [
                [
                    'email' => $to,
                ]
            ],
            'subject' => $subject,
            'htmlContent' => $htmlBody,
        ]);
        if (!$response->successful()) {
        \Log::error('Brevo mail failed', ['response' => $response->body()]);
}

        return $response->successful();
    }
}
