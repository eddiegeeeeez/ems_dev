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

Route::get('/', function () {
    // If user is already authenticated, redirect to dashboard
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return view('home'); 
})->name('home.hero');


Route::get('/login', function () {
    // If user is already authenticated, redirect to dashboard
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return view('auth.login');
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


Route::middleware('auth')->group(function () {

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

    // Notification Routes
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])
            ->name('index');
        Route::post('/{notificationId}/mark-read', [NotificationController::class, 'markAsRead'])
            ->name('mark-read');
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead'])
            ->name('mark-all-read');
        Route::delete('/{notificationId}', [NotificationController::class, 'delete'])
            ->name('delete');
        Route::delete('/clear-all', [NotificationController::class, 'clearAll'])
            ->name('clear-all');
    });

    // Admin Routes
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'admin'])
            ->name('dashboard');

        // Bookings Management
        Route::get('/requests', [RequestController::class, 'index'])
            ->name('requests.index');
        Route::get('/requests/{booking}', [RequestController::class, 'show'])
            ->name('requests.show');
        Route::post('/requests/{booking}/approve', [RequestController::class, 'approve'])
            ->name('requests.approve');
        Route::patch('/requests/{booking}/reject', [RequestController::class, 'reject'])
            ->name('requests.reject');

        Route::get('/calendar', [CalendarController::class, 'index'])
            ->name('calendar.index');
        Route::get('/calendar/events', [CalendarController::class, 'getEvents'])
            ->name('calendar.events');
        Route::post('/calendar/event-details/{id}', [CalendarController::class, 'eventDetails'])
            ->name('calendar.event-details');

        // Facilities Management
        Route::resource('/venues', AdminVenueController::class, ['as' => 'venues'])->names([
            'index' => 'venues.index',
            'create' => 'venues.create',
            'store' => 'venues.store',
            'show' => 'venues.show',
            'edit' => 'venues.edit',
            'update' => 'venues.update',
            'destroy' => 'venues.destroy',
        ]);
        Route::post('/venues/{venue}/toggle-active', [AdminVenueController::class, 'toggleActive'])
            ->name('venues.toggle-active');

        Route::resource('/equipment', AdminEquipmentController::class, ['as' => 'equipment'])->names([
            'index' => 'equipment.index',
            'create' => 'equipment.create',
            'store' => 'equipment.store',
            'show' => 'equipment.show',
            'edit' => 'equipment.edit',
            'update' => 'equipment.update',
            'destroy' => 'equipment.destroy',
        ]);

        Route::prefix('maintenance')->name('maintenance.')->group(function () {
            Route::get('/requests', [MaintenanceController::class, 'requests'])
                ->name('requests');
            Route::get('/requests/create', [MaintenanceController::class, 'create'])
                ->name('create');
            Route::post('/requests', [MaintenanceController::class, 'storeScheduled'])
                ->name('store');
            Route::post('/requests/{maintenance}/assign', [MaintenanceController::class, 'assign'])
                ->name('assign');
            Route::patch('/requests/{maintenance}/status', [MaintenanceController::class, 'updateRequestStatus'])
                ->name('update-status');
            Route::delete('/requests/{maintenance}', [MaintenanceController::class, 'destroy'])
                ->name('destroy');
            
            Route::get('/scheduled', [MaintenanceController::class, 'scheduled'])
                ->name('scheduled');
        });

        // Reports & Analytics
        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('/venue-utilization', [ReportController::class, 'venueUtilization'])
                ->name('venue');
            Route::get('/venue-utilization/data', [ReportController::class, 'venueUtilizationData'])
                ->name('venue.data');

            Route::get('/booking-statistics', [ReportController::class, 'bookingStatistics'])
                ->name('bookings');
            Route::get('/booking-statistics/data', [ReportController::class, 'bookingStatisticsData'])
                ->name('bookings.data');

            Route::get('/export', [ReportController::class, 'export'])
                ->name('export');
            Route::post('/export', [ReportController::class, 'doExport'])
                ->name('export.do');
        });

        // User Management
        Route::get('/users', [UserController::class, 'index'])
            ->name('users.index');
        Route::get('/users/{user}', [UserController::class, 'show'])
            ->name('users.show');
        Route::post('/users/{user}/role', [UserController::class, 'updateRole'])
            ->name('users.update-role');
        Route::post('/users/{user}/deactivate', [UserController::class, 'deactivate'])
            ->name('users.deactivate');
        Route::post('/users/{user}/activate', [UserController::class, 'activate'])
            ->name('users.activate');

        Route::get('/departments', [DepartmentController::class, 'index'])
            ->name('departments.index');
        Route::get('/departments/create', [DepartmentController::class, 'create'])
            ->name('departments.create');
        Route::post('/departments', [DepartmentController::class, 'store'])
            ->name('departments.store');
        Route::get('/departments/{id}/edit', [DepartmentController::class, 'edit'])
            ->name('departments.edit');
        Route::put('/departments/{id}', [DepartmentController::class, 'update'])
            ->name('departments.update');
        Route::delete('/departments/{id}', [DepartmentController::class, 'destroy'])
            ->name('departments.destroy');

        Route::get('/audit-logs', [AuditLogController::class, 'index'])
            ->name('audit-logs.index');
        Route::get('/audit-logs/search', [AuditLogController::class, 'search'])
            ->name('audit-logs.search');

        // System Settings
        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/booking-rules', [SettingsController::class, 'bookingRules'])
                ->name('booking-rules');
            Route::post('/booking-rules', [SettingsController::class, 'updateBookingRules'])
                ->name('booking-rules.update');

            Route::get('/email-templates', [SettingsController::class, 'emailTemplates'])
                ->name('email-templates');
            Route::post('/email-templates', [SettingsController::class, 'updateEmailTemplate'])
                ->name('email-templates.update');

            Route::get('/general', [SettingsController::class, 'general'])
                ->name('general');
            Route::post('/general', [SettingsController::class, 'updateGeneral'])
                ->name('general.update');
        });
    });
});
