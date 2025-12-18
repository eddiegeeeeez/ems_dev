<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\User;
use App\Notifications\BookingApprovedNotification;
use App\Notifications\BookingRejectedNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BookingService
{
    /**
     * Create a new booking
     */
    public function createBooking(array $data): Booking
    {
        $booking = Booking::create($data);
        $this->notifyAdmins('new_booking_request', $booking);
        
        // Log booking creation
        \App\Services\AuditService::log(
            'booking_created', 
            'Booking', 
            $booking->id, 
            null, 
            $data, 
            "New booking created: {$booking->event_title}"
        );

        return $booking;
    }

    /**
     * Approve a booking
     */
    public function approveBooking(Booking $booking, ?string $notes = null): Booking
    {
        // Load user relationship if not already loaded
        if (!$booking->relationLoaded('user')) {
            $booking->load('user');
        }

        $booking->update([
            'status' => 'approved',
            'notes' => $notes,
        ]);

        // Send notification to user
        if ($booking->user) {
            $booking->user->notify(new BookingApprovedNotification($booking));
        }

        // Log approval
        \App\Services\AuditService::logBookingApproval($booking->id, $notes);

        return $booking;
    }

    /**
     * Reject a booking
     */
    public function rejectBooking(Booking $booking, string $reason): Booking
    {
        // Load user relationship if not already loaded
        if (!$booking->relationLoaded('user')) {
            $booking->load('user');
        }

        $booking->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
        ]);

        // Send notification to user
        if ($booking->user) {
            $booking->user->notify(new BookingRejectedNotification($booking));
        }
        
        // Log rejection
        \App\Services\AuditService::logBookingRejection($booking->id, $reason);

        return $booking;
    }

    /**
     * Calculate total cost for booking
     */
    public function calculateBookingCost(Booking $booking): void
    {
        $venueCost = 0;
        $equipmentCost = 0;

        // Calculate venue cost (hourly_rate removed: treat as 0 if absent)
        $rate = $booking->venue->hourly_rate ?? 0;
        if ($rate > 0) {
            $hours = $booking->duration_in_hours;
            $venueCost = $rate * $hours;
        }

        // Calculate equipment cost
        $equipmentCost = $booking->equipment()->sum('subtotal');

        $booking->update(['total_cost' => $venueCost + $equipmentCost]);
    }

    /**
     * Get pending bookings for admin
     */
    public function getPendingBookings(int $perPage = 15): Paginator
    {
        return Booking::pending()
            ->with('user', 'venue')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get user's bookings
     */
    public function getUserBookings(int $userId, int $perPage = 10): Paginator
    {
        return Booking::where('user_id', $userId)
            ->with('venue')
            ->orderBy('start_datetime', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get upcoming bookings
     */
    public function getUpcomingBookings(int $limit = 5)
    {
        return Booking::approved()
            ->upcoming()
            ->with('user', 'venue')
            ->orderBy('start_datetime', 'asc')
            ->limit($limit)
            ->get();
    }

    /**
     * Notify admins
     */
    private function notifyAdmins(string $type, Booking $booking): void
    {
        // Get admin users
        $admins = \App\Models\User::where('role', 'ADMIN')->get();

        // Ensure relationships are loaded for message details
        if (!$booking->relationLoaded('user')) {
            $booking->load('user');
        }
        if (!$booking->relationLoaded('venue')) {
            $booking->load('venue');
        }

        $organizer = $booking->user ? $booking->user->name : 'Unknown Organizer';
        $date = $booking->start_datetime ? $booking->start_datetime->format('M d, Y') : 'N/A';
        $time = $booking->start_datetime ? $booking->start_datetime->format('g:i A') : 'N/A';

        foreach ($admins as $admin) {
            // Send email notification
            Mail::to($admin->email)->send(new BookingRequestReceived($booking));

            Notification::create([
                'type' => $type,
                'notifiable_type' => User::class,
                'notifiable_id' => $admin->id,
                'data' => [
                    'message' => "New request from {$organizer}: {$booking->event_title} at {$booking->venue->name} on {$date} at {$time}",
                    'booking_id' => $booking->id,
                ],
            ]);
        }
    }

    /**
     * Notify user
     */
    private function notifyUser(\App\Models\User $user, string $type, Booking $booking): void
    {
        $titles = [
            'booking_approved' => 'Booking Approved!',
            'booking_rejected' => 'Booking Rejected',
            'booking_completed' => 'Event Completed',
        ];

        Notification::create([
            'type' => $type,
            'notifiable_type' => User::class,
            'notifiable_id' => $user->id,
            'data' => [
                'message' => "Your booking for {$booking->event_title} has been " . str_replace('booking_', '', $type),
                'booking_id' => $booking->id,
            ],
        ]);
    }
}
