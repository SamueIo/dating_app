<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\BlockUserController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\ExploreController;
use App\Http\Controllers\MatchesController;
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FilterController;
use App\Http\Controllers\SwipeController;
use App\Http\Controllers\UserController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])
    ->group(function(){
    Route::get('/user', function (Request $request) {
        return $request->user()->load('mainPhoto');
    });

    Route::get('/profile', [ProfileController::class, 'getProfile']);
    Route::patch('/profile', [ProfileController::class, 'updateProfile']);

    Route::get('/photos', [PhotoController::class, 'index']);
    Route::post('/photos', [PhotoController::class, 'store']);
    Route::put('/photos', [PhotoController::class, 'update']);
    Route::delete('/photos/{id}/destroy', [PhotoController::class, 'destroy']);
    Route::put('/photos/{id}/main', [PhotoController::class, 'setMain']);
    Route::put('/photos/{id}/description', [PhotoController::class, 'editDescription']);

    Route::get('/explore', [ExploreController::class, 'index']);

    Route::get('/filters', [FilterController::class, 'show']);
    Route::post('/filters', [FilterController::class, 'store']);

    Route::get('/users/{id}',[UserController::class, 'show']);

    Route::get('/swipes', [SwipeController::class, 'index']);

    Route::post('/swipes', [SwipeController::class, 'swipe']);

    Route::get('/matches', [MatchesController::class, 'index']);

    // Chat conversations
    Route::get('/conversation', [ConversationController::class, 'showConversations']);
    Route::post('/conversation',[ConversationController::class, 'createConversation']);
    Route::get('/conversation/{id}', [ConversationController::class, 'showConversationById']);


    Route::get('/conversation/{conversationId}/messages', [ConversationController::class, 'getMessages']);
    Route::post('/conversation/{conversationId}/messages', [ConversationController::class, 'storeMessages']);
    Route::post('/conversation/{id}/seen', [ConversationController::class, 'markAsSeen']);

    Route::post('/blockUser/{id}', [BlockUserController::class, 'blockUser']);
    Route::post('/unblockUser/{id}', [BlockUserController::class, 'unblock']);
    Route::get('/blockedUsers', [BlockUserController::class, 'blockedList']);

    Route::post('/activity', [ActivityController::class, 'updateUserActivity']);
    Route::get('/activity', [ActivityController::class, 'getUserActivities']);
});



