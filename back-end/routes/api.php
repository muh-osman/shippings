<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\UploadedController;




// Group for protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Return the authenticated user and his token (http://localhost:8000/api/user)
    Route::get('user', function (Request $request) {
        return [
            'user' => $request->user(),
            'currentToken' => $request->bearerToken()
        ];
    });

    // Logout Route (http://localhost:8000/api/logout)
    Route::post('/logout', [UserController::class, 'logout']);


    // Resend verification email (http://localhost:8000/api/resend-verify-email)
    Route::post('/resend-verify-email', [UserController::class, 'resendVerifyEmail']);


    // Show all posts:      method GET    =>  http://localhost:8000/api/posts
    // Create post:         method POST   =>  http://localhost:8000/api/posts
    // Show post by id:     method GET    =>  http://localhost:8000/api/posts/1
    // Update post by id:   method POST   =>  http://localhost:8000/api/posts/1?_method=PATCH
    // Delete post by id:   method DELETE =>  http://localhost:8000/api/posts/1



    Route::get('/clients', [ClientController::class, 'index']); // Get all clients
    Route::post('/clients', [ClientController::class, 'store']); // Create a new client
    Route::get('/clients/{client}', [ClientController::class, 'show']); // Get a specific client
    Route::post('/clients/{client}', [ClientController::class, 'update']); // Update a specific client
    Route::delete('/clients/{client}', [ClientController::class, 'destroy']); // Delete a specific client

    Route::post('/bulk-create-orders', [ClientController::class, 'bulkCreateOrders']);

    Route::get('/uploaded-clients', [UploadedController::class, 'index']); // Get all uploaded clients

    Route::post('/check-status-client', [UploadedController::class, 'checkClientStatus']);
});


// Group for guest routes
Route::middleware('guest')->group(function () {
    // Register Route (http://localhost:8000/api/register)
    Route::post('/register', [UserController::class, 'register']);

    // Login Route (http://localhost:8000/api/login)
    Route::post('/login', [UserController::class, 'login']);

    // Email verification endpoint (http://localhost:8000/api/verify-email)
    Route::post('/verify-email', [UserController::class, 'verifyEmail'])->name('verification.verify');

    // Password Reset Route (http://localhost:8000/api/forgot-password)
    Route::post('/forgot-password', [UserController::class, 'forgotPassword'])->name('password.email');

    // API route for resetting the password (http://localhost:8000/api/reset-password)
    Route::post('/reset-password', [UserController::class, 'resetPassword'])->name('password.reset');
});
