<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditService
{
    /**
     * Log an audit entry for user actions
     */
    public static function log(
        string $action,
        string $modelType,
        $modelId = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $description = null
    ): AuditLog {
        $user = Auth::user();
        
        return AuditLog::create([
            'user_id' => $user?->id,
            'action' => $action,
            'model_type' => $modelType,
            'model_id' => $modelId,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'description' => $description,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }

    /**
     * Log booking approval
     */
    public static function logBookingApproval($bookingId, $notes = null): AuditLog
    {
        return self::log(
            'booking_approved',
            'Booking',
            $bookingId,
            null,
            ['status' => 'approved', 'notes' => $notes],
            'Booking request approved'
        );
    }

    /**
     * Log booking rejection
     */
    public static function logBookingRejection($bookingId, $reason = null): AuditLog
    {
        return self::log(
            'booking_rejected',
            'Booking',
            $bookingId,
            null,
            ['status' => 'rejected', 'reason' => $reason],
            'Booking request rejected'
        );
    }

    /**
     * Log user role change
     */
    public static function logUserRoleChange($userId, $oldRole, $newRole): AuditLog
    {
        return self::log(
            'user_role_changed',
            'User',
            $userId,
            ['role' => $oldRole],
            ['role' => $newRole],
            "User role changed from $oldRole to $newRole"
        );
    }

    /**
     * Log venue creation
     */
    public static function logVenueCreation($venueId, array $venueData): AuditLog
    {
        return self::log(
            'venue_created',
            'Venue',
            $venueId,
            null,
            $venueData,
            'New venue created: ' . ($venueData['name'] ?? 'Unknown')
        );
    }

    /**
     * Log venue update
     */
    public static function logVenueUpdate($venueId, $venueName, array $oldValues, array $newValues): AuditLog
    {
        return self::log(
            'venue_updated',
            'Venue',
            $venueId,
            $oldValues,
            $newValues,
            'Venue updated: ' . $venueName
        );
    }

    /**
     * Log equipment creation
     */
    public static function logEquipmentCreation($equipmentId, array $equipmentData): AuditLog
    {
        return self::log(
            'equipment_created',
            'Equipment',
            $equipmentId,
            null,
            $equipmentData,
            'New equipment created: ' . ($equipmentData['name'] ?? 'Unknown')
        );
    }

    /**
     * Log equipment update
     */
    public static function logEquipmentUpdate($equipmentId, $equipmentName, array $oldValues, array $newValues): AuditLog
    {
        return self::log(
            'equipment_updated',
            'Equipment',
            $equipmentId,
            $oldValues,
            $newValues,
            'Equipment updated: ' . $equipmentName
        );
    }

    /**
     * Log maintenance request creation
     */
    public static function logMaintenanceCreation($maintenanceId, array $maintenanceData): AuditLog
    {
        return self::log(
            'maintenance_created',
            'Maintenance',
            $maintenanceId,
            null,
            $maintenanceData,
            'New maintenance request created: ' . ($maintenanceData['title'] ?? 'Unknown')
        );
    }

    /**
     * Log maintenance status update
     */
    public static function logMaintenanceUpdate($maintenanceId, $oldStatus, $newStatus): AuditLog
    {
        return self::log(
            'maintenance_updated',
            'Maintenance',
            $maintenanceId,
            ['status' => $oldStatus],
            ['status' => $newStatus],
            "Maintenance status updated from $oldStatus to $newStatus"
        );
    }

    /**
     * Log user deletion
     */
    public static function logUserDeletion($userId, $userName): AuditLog
    {
        return self::log(
            'user_deleted',
            'User',
            $userId,
            null,
            ['deleted_at' => now()->toDateTimeString()],
            "User deleted: $userName"
        );
    }

    /**
     * Log user restoration
     */
    public static function logUserRestoration($userId, $userName): AuditLog
    {
        return self::log(
            'user_restored',
            'User',
            $userId,
            null,
            ['restored_at' => now()->toDateTimeString()],
            "User restored: $userName"
        );
    }

    /**
     * Log login
     */
    public static function logLogin($userId, $userEmail): AuditLog
    {
        return self::log(
            'user_login',
            'User',
            $userId,
            null,
            ['email' => $userEmail, 'login_at' => now()->toDateTimeString()],
            "User logged in: $userEmail"
        );
    }

    /**
     * Log logout
     */
    public static function logLogout($userId, $userEmail): AuditLog
    {
        return self::log(
            'user_logout',
            'User',
            $userId,
            null,
            ['email' => $userEmail, 'logout_at' => now()->toDateTimeString()],
            "User logged out: $userEmail"
        );
    }

    /**
     * Log failed login attempt
     */
    public static function logFailedLogin($email): AuditLog
    {
        return self::log(
            'failed_login',
            'User',
            null,
            null,
            ['email' => $email, 'failed_at' => now()->toDateTimeString()],
            "Failed login attempt for: $email"
        );
    }

    /**
     * Log authorization failure
     */
    public static function logAuthorizationFailure(string $action, string $modelType, $modelId = null): AuditLog
    {
        $user = Auth::user();
        return self::log(
            'authorization_failed',
            $modelType,
            $modelId,
            null,
            ['attempted_action' => $action],
            "Authorization failed for action: $action"
        );
    }

    /**
     * Log settings change
     */
    public static function logSettingsChange($settingKey, $oldValue, $newValue): AuditLog
    {
        return self::log(
            'settings_changed',
            'Settings',
            null,
            [$settingKey => $oldValue],
            [$settingKey => $newValue],
            "System setting changed: $settingKey"
        );
    }
}
