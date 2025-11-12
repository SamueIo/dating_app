<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Reset Password</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#59168b; font-family:sans-serif; color:#2c2c2c; width:100%;">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; min-height:100vh;">
        <tr>
            <td align="center" valign="top" style="padding:16px;">

                <!-- Názov hore -->
                <h2 style="color:white; margin-bottom:16px; font-size:28px; line-height:32px;">MatchLove</h2>

                <!-- Hlavný box -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; width:100%; background-color:#6a2e97; border:2px solid #953ea0; border-radius:16px; box-shadow:0 4px 6px rgba(0,0,0,0.1); padding:24px; color:#171717; box-sizing:border-box;">
                    <tr>
                        <td align="left" style="font-size:18px; line-height:1.6;">

                            <!-- Header -->
                            <p style="font-size:22px; line-height:28px; margin-bottom:16px; color:#ffffff;">Hello {{ $user->name }},</p>

                            <!-- Intro -->
                            <p style="margin-bottom:16px; color:#171717; font-size:18px; line-height:26px;">
                                You are receiving this email because we received a password reset request for your account.
                            </p>

                            <!-- Tlačidlo -->
                            <p style="text-align:center; margin:20px 0;">
                                <a href="{{ $actionUrl }}" style="display:inline-block; background-color:#b597cc; color:#ffffff; font-weight:bold; padding:14px 28px; border-radius:12px; text-decoration:none; box-shadow:0 2px 4px rgba(0,0,0,0.1); font-size:18px;">
                                    Reset Password
                                </a>
                            </p>

                            <!-- Outro -->
                            <p style="margin-bottom:8px; color:#171717; font-size:18px; line-height:26px;">If you did not request a password reset, no further action is required.</p>
                            <p style="margin-bottom:4px; color:#171717; font-size:18px; line-height:26px;">Regards,</p>
                            <p style="color:#171717; font-size:18px; line-height:26px;">{{ config('app.name') }}</p>

                            <!-- Subcopy -->
                            <p style="margin-top:16px; font-size:14px; color:#171717; word-break:break-word; line-height:20px;">
                                If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:
                                <br>
                                <a href="{{ $actionUrl }}" style="color:#eaeaea; text-decoration:underline; font-size:14px;">{{ $actionUrl }}</a>
                            </p>

                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <p style="margin-top:16px; font-size:14px; color:#9ca3af; text-align:center;">© 2025 Matchlove. All rights reserved.</p>

            </td>
        </tr>
    </table>

</body>
</html>
