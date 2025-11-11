<?php

namespace App\Services;

use Brevo\Client\Api\TransactionalEmailsApi;
use Brevo\Client\Configuration;
use Brevo\Client\Model\SendSmtpEmail;
use GuzzleHttp\Client;

class BrevoMailService
{
    protected $api;

    public function __construct()
    {
        $config = Configuration::getDefaultConfiguration()->setApiKey('api-key', env('BREVO_API_KEY'));
        $this->api = new TransactionalEmailsApi(new Client(), $config);
    }

    public function sendEmail(string $toEmail, string $toName, string $subject, string $htmlContent)
    {
        $sendSmtpEmail = new SendSmtpEmail([
            'sender' => [
                'name' => env('MAIL_FROM_NAME'),
                'email' => env('MAIL_FROM_ADDRESS')
            ],
            'to' => [
                ['email' => $toEmail, 'name' => $toName]
            ],
            'subject' => $subject,
            'htmlContent' => $htmlContent
        ]);

        return $this->api->sendTransacEmail($sendSmtpEmail);
    }
}
