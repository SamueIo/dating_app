<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Reset Password</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#59168b] font-sans text-gray-200">

    <div class="min-h-screen flex items-center justify-center p-6">
        <!-- Vnútorný div -->
        <div class="bg-[#6a2e97] border-2 border-[#953ea0] rounded-xl shadow-lg p-8 w-full max-w-md text-gray-100">

            <!-- Header -->
            <h1 class="text-2xl font-bold mb-4">Reset Your Password</h1>
            <p class="mb-6">Hello {{ $user->name }},</p>

            <!-- Intro -->
            <p class="mb-6">
                Click the button below to reset your password:
            </p>

            <!-- Tlačidlo -->
            <div class="text-center mb-6">
                <a href="{{ $actionUrl }}" class="inline-block bg-[#b597cc] hover:bg-[#a17bbf] text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors">
                    Reset Password
                </a>
            </div>

            <!-- Outro -->
            <p class="mb-4">If you did not request a password reset, no further action is required.</p>
            <p class="mb-2">Regards,</p>
            <p class="font-bold">{{ config('app.name') }}</p>

            <!-- Subcopy -->
            <p class="mt-6 text-sm text-gray-300 break-all">
                If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:
                <br>
                <a href="{{ $actionUrl }}" class="underline text-gray-200">{{ $actionUrl }}</a>
            </p>

        </div>
    </div>

</body>
</html>
