<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\RequestController;
use App\Http\Controllers\Admin\CalendarController;
use App\Http\Controllers\Admin\EquipmentController;
use App\Http\Controllers\Admin\MaintenanceController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\VenueController as AdminVenueController;
use App\Http\Controllers\Admin\EquipmentController as AdminEquipmentController;
use App\Http\Controllers\NotificationController;

// Redirect root to React frontend
Route::get('/', function () {
    return redirect(env('FRONTEND_URL', 'http://localhost:3000'));
})->name('home');

// Redirect login to React frontend
Route::get('/login', function () {
    return redirect(env('FRONTEND_URL', 'http://localhost:3000'));
})->name('login');

Route::get('/auth/google', [GoogleController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);

// Development-only temporary login helper (ADMIN / ORGANIZER)
Route::get('/temp-login/{role}', function ($role) {
    // Prevent use in production
    if (app()->environment('production')) {
        abort(404);
    }

    $role = strtoupper($role);
    if (!in_array($role, ['ADMIN', 'ORGANIZER'])) {
        abort(404);
    }

    $user = \App\Models\User::where('role', $role)->first();

    // If no user with that role exists, try to find a sensible fallback for ADMIN
    if (! $user && $role === 'ADMIN') {
        $adminEmails = config('admin_emails.admin_emails', []);
        if (! empty($adminEmails)) {
            $user = \App\Models\User::where('email', $adminEmails[0])->first();
        }
    }

    // As last resort, create a temporary user (local/dev only)
    if (! $user) {
        $user = \App\Models\User::create([
            'name' => $role === 'ADMIN' ? 'Temporary Admin' : 'Temporary Organizer',
            'email' => $role === 'ADMIN' ? 'temp-admin@example.test' : 'temp-organizer@example.test',
            'password' => \Illuminate\Support\Facades\Hash::make(\Illuminate\Support\Str::random(16)),
            'role' => $role,
        ]);
    }

    \Illuminate\Support\Facades\Auth::login($user);

    return redirect()->route('dashboard');
})->name('temp.login');


// All routes are now in api.php for React frontend
// Only keep auth callback for Google OAuth
Route::middleware('auth')->group(function () {
    // Logout can stay here for web middleware support
    Route::post('/logout', [ProfileController::class, 'logout'])
        ->name('logout');
});
