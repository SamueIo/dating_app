<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Response;
use Throwable;

class Handler extends ExceptionHandler
{
    // ... ostatné metódy ...

    protected function unauthenticated($request, AuthenticationException $exception)
    {
        \Log::info('unauthenticated called', ['url' => $request->url()]);
        if ($request->expectsJson() || $request->is('broadcasting/auth')) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return redirect()->guest(route('login'));
    }
}
