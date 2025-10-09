<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Broadcast;



Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::post('/broadcasting/auth', function (Request $request) {
    Log::info('Broadcast auth user:', ['user' => auth()->user()]);
    return Broadcast::auth($request);
})->middleware('auth:sanctum');

Route::middleware('web')->group(function () {
    require __DIR__.'/auth.php';
});


