<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Reset Password</title>
</head>
<body style="margin:0; padding:0; background-color:#59168b; font-family:sans-serif; color:#2c2c2c; width:100%;">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; min-height:100vh;">
        <tr>
            <td align="center" valign="top" style="padding:40px 20px;">

                <!-- Box uprostred -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; width:100%; background-color:#ffffff10; border:2px solid #953ea0; border-radius:20px; padding:32px; color:#f3f4f6; box-sizing:border-box;">
                    <tr>
                        <td align="center">
                            <!-- Header -->
                            <h1 style="font-weight:bold; font-size:28px; margin-bottom:16px; color:#ffffff;">Reset Your Password</h1>
                            <p style="font-size:20px; margin-bottom:24px; color:#f3f4f6;">Hello {{ $user->name }},</p>

                            <!-- Intro -->
                            <p style="margin-bottom:24px; font-size:16px; line-height:1.5; color:#f3f4f6;">
                                You are receiving this email because we received a password reset request for your account.
                            </p>

                            <!-- Tlačidlo -->
                            <p style="text-align:center; margin-bottom:24px;">
                                <a href="{{ $actionUrl }}" style="display:inline-block; background-color:#b597cc; color:white; font-weight:bold; padding:12px 24px; border-radius:12px; text-decoration:none;">
                                    Reset Password
                                </a>
                            </p>

                            <!-- Outro -->
                            <p style="margin-bottom:16px; font-size:16px; color:#f3f4f6;">If you did not request a password reset, no further action is required.</p>
                            <p style="margin-bottom:4px; font-size:16px; color:#f3f4f6;">Regards,</p>
                            <p style="font-weight:bold; font-size:16px; color:#f3f4f6;">{{ config('app.name') }}</p>

                            <!-- Subcopy -->
                            <p style="margin-top:24px; font-size:12px; color:#d1d5db; word-break:break-word;">
                                If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:
                                <br>
                                <a href="{{ $actionUrl }}" style="color:#f3f4f6; text-decoration:underline;">{{ $actionUrl }}</a>
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <p style="margin-top:24px; font-size:12px; color:#9ca3af; text-align:center;">© 2025 Matchlove. All rights reserved.</p>
            </td>
        </tr>
    </table>

</body>
</html>
