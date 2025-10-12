<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Response;
use Throwable;
use Illuminate\Support\Facades\Log;

class Handler extends ExceptionHandler
{
    // Ak tam je vlastné $dontReport, nechaj tak, inak môžeš pridať podľa potreby

    public function report(Throwable $exception)
    {
        // Tu logujeme každú výnimku (error)
        Log::error('Exception caught: ' . $exception->getMessage(), [
            'exception' => $exception,
            'trace' => $exception->getTraceAsString(),
        ]);

        parent::report($exception);
    }

    protected function unauthenticated($request, AuthenticationException $exception)
    {
        Log::info('unauthenticated called', ['url' => $request->url()]);

        if ($request->expectsJson() || $request->is('broadcasting/auth')) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return redirect()->guest(route('login'));
    }
}
