<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ProfileController;

// Google OAuth routes
Route::get('/login', function () {
    return view('auth.login');
})->name('login');

Route::get('/auth/google', [GoogleController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);

Route::middleware('auth')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])
         ->name('home');

    Route::get('/dashboard', [DashboardController::class, 'index'])
         ->name('dashboard');
    Route::get('/venues', [VenueController::class, 'index'])
         ->name('venues.index');
    Route::get('/bookings', [BookingController::class, 'index'])
         ->name('bookings.index');
    Route::get('/feedback', [FeedbackController::class, 'index'])
         ->name('feedback.index');
    Route::get('/profile', [ProfileController::class, 'show'])
         ->name('profile.show');
    Route::post('/logout', [ProfileController::class, 'logout'])
         ->name('logout');
});