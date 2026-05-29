<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\UploadController;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Posts
    Route::apiResource('posts', PostController::class);
    Route::get('/posts/{id}', [PostController::class, 'show']);
    
    Route::post('/upload', [UploadController::class, 'store']);

    // Comments
    Route::apiResource('comments', CommentController::class);

    // Auth
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Likes

     Route::get(
        '/liked-posts',
        [LikeController::class, 'likedPosts']
    );

    Route::post('/posts/{post}/like', [LikeController::class, 'store']);

    Route::delete('/posts/{post}/like', [LikeController::class, 'destroy']);
});