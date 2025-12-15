<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotificationController;
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

// Public routes
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'message' => 'API is running']);
});

// Auth routes - NO auth:sanctum middleware on login
Route::prefix('auth')->group(function () {
    Route::post('/login', [LoginController::class, 'login']);
    Route::get('/google', [GoogleController::class, 'redirectToGoogle']);
    Route::get('/google/callback', [GoogleController::class, 'handleGoogleCallback']);
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/user', [LoginController::class, 'user']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    
    // Venues
    Route::prefix('venues')->group(function () {
        Route::get('/', [VenueController::class, 'index']);
        Route::get('/{id}', [VenueController::class, 'show']);
    });
    
    // Bookings
    Route::prefix('bookings')->group(function () {
        Route::get('/search/qr-code', [BookingController::class, 'searchByQrCode']);
        Route::get('/', [BookingController::class, 'index']);
        Route::post('/', [BookingController::class, 'store']);
        Route::get('/{id}', [BookingController::class, 'show']);
        Route::put('/{id}', [BookingController::class, 'update']);
        Route::delete('/{id}', [BookingController::class, 'destroy']);
    });
    
    // Feedback
    Route::prefix('feedback')->group(function () {
        Route::get('/', [FeedbackController::class, 'index']);
        Route::post('/', [FeedbackController::class, 'store']);
    });
    
    // Profile
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/update', [ProfileController::class, 'update']);
        Route::put('/settings', [ProfileController::class, 'updateSettings']);
        Route::get('/export', [ProfileController::class, 'export']);
        Route::delete('/delete', [ProfileController::class, 'delete']);
    });
    
    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::post('/{id}/mark-read', [NotificationController::class, 'markAsRead']);
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/{id}', [NotificationController::class, 'delete']);
        Route::delete('/clear-all', [NotificationController::class, 'clearAll']);
    });
    
    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        
        // Admin Dashboard
        Route::get('/dashboard', [DashboardController::class, 'admin']);
        
        // Booking Requests
        Route::prefix('requests')->group(function () {
            Route::get('/', [RequestController::class, 'index']);
            Route::get('/{id}', [RequestController::class, 'show']);
            Route::post('/{id}/approve', [RequestController::class, 'approve']);
            Route::post('/{id}/reject', [RequestController::class, 'reject']);
        });
        
        // Calendar
        Route::prefix('calendar')->group(function () {
            Route::get('/', [CalendarController::class, 'index']);
            Route::get('/events', [CalendarController::class, 'getEvents']);
            Route::get('/events/{id}', [CalendarController::class, 'eventDetails']);
        });
        
        // Admin Venues Management
        Route::prefix('venues')->group(function () {
            Route::get('/', [AdminVenueController::class, 'index']);
            Route::post('/', [AdminVenueController::class, 'store']);
            Route::get('/{id}', [AdminVenueController::class, 'show']);
            Route::put('/{id}', [AdminVenueController::class, 'update']);
            Route::delete('/{id}', [AdminVenueController::class, 'destroy']);
            Route::post('/{id}/toggle-active', [AdminVenueController::class, 'toggleActive']);
        });
        
        // Equipment Management
        Route::prefix('equipment')->group(function () {
            Route::get('/', [EquipmentController::class, 'index']);
            Route::post('/', [EquipmentController::class, 'store']);
            Route::get('/{id}', [EquipmentController::class, 'show']);
            Route::put('/{id}', [EquipmentController::class, 'update']);
            Route::delete('/{id}', [EquipmentController::class, 'destroy']);
        });
        
        // Maintenance
        Route::prefix('maintenance')->group(function () {
            Route::get('/requests', [MaintenanceController::class, 'requests']);
            Route::post('/requests', [MaintenanceController::class, 'storeScheduled']);
            Route::post('/requests/{id}/assign', [MaintenanceController::class, 'assign']);
            Route::put('/requests/{id}/status', [MaintenanceController::class, 'updateRequestStatus']);
            Route::delete('/requests/{id}', [MaintenanceController::class, 'destroy']);
            Route::get('/scheduled', [MaintenanceController::class, 'scheduled']);
        });
        
        // Reports
        Route::prefix('reports')->group(function () {
            Route::get('/venue-utilization', [ReportController::class, 'venueUtilizationData']);
            Route::get('/booking-statistics', [ReportController::class, 'bookingStatisticsData']);
            Route::post('/export', [ReportController::class, 'doExport']);
        });
        
        // Users Management
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index']);
            Route::get('/{id}', [UserController::class, 'show']);
            Route::post('/{id}/role', [UserController::class, 'updateRole']);
            Route::post('/{id}/deactivate', [UserController::class, 'deactivate']);
            Route::post('/{id}/activate', [UserController::class, 'activate']);
        });
        
        // Departments
        Route::prefix('departments')->group(function () {
            Route::get('/', [DepartmentController::class, 'index']);
            Route::post('/', [DepartmentController::class, 'store']);
            Route::get('/{id}', [DepartmentController::class, 'show']);
            Route::put('/{id}', [DepartmentController::class, 'update']);
            Route::delete('/{id}', [DepartmentController::class, 'destroy']);
        });
        
        // Audit Logs
        Route::prefix('audit-logs')->group(function () {
            Route::get('/', [AuditLogController::class, 'index']);
            Route::get('/search', [AuditLogController::class, 'search']);
        });
        
        // Settings
        Route::prefix('settings')->group(function () {
            Route::get('/booking-rules', [SettingsController::class, 'bookingRules']);
            Route::put('/booking-rules', [SettingsController::class, 'updateBookingRules']);
            Route::get('/email-templates', [SettingsController::class, 'emailTemplates']);
            Route::post('/email-templates/request-otp', [SettingsController::class, 'requestEmailTemplateOtp']);
            Route::post('/email-templates/preview', [SettingsController::class, 'previewEmailTemplate']);
            Route::post('/email-templates/send-test', [SettingsController::class, 'sendTestEmail']);
            Route::put('/email-templates', [SettingsController::class, 'updateEmailTemplate']);
            Route::get('/general', [SettingsController::class, 'general']);
            Route::put('/general', [SettingsController::class, 'updateGeneral']);
        });
    });
});
