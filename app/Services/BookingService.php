<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Notification;
use App\Mail\BookingApproved;
use App\Mail\BookingRejected;
use App\Mail\BookingRequestReceived;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Mail;

class BookingService
{
    /**
     * Create a new booking
     */
    public function createBooking(array $data): Booking
    {
        $booking = Booking::create($data);
        $this->notifyAdmins('new_booking_request', $booking);

        return $booking;
    }

    /**
     * Approve a booking
     */
    public function approveBooking(Booking $booking, ?string $notes = null): Booking
    {
        $booking->update([
            'status' => 'approved',
            'notes' => $notes,
        ]);

        // Calculate costs if venue has hourly rate
        $this->calculateBookingCost($booking);

        // Send approval email
        Mail::to($booking->user->email)->send(new BookingApproved($booking));

        $this->notifyUser($booking->user, 'booking_approved', $booking);

        return $booking;
    }

    /**
     * Reject a booking
     */
    public function rejectBooking(Booking $booking, string $reason): Booking
    {
        $booking->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
        ]);

        // Send rejection email
        Mail::to($booking->user->email)->send(new BookingRejected($booking));

        $this->notifyUser($booking->user, 'booking_rejected', $booking);

        return $booking;
    }

    /**
     * Calculate total cost for booking
     */
    public function calculateBookingCost(Booking $booking): void
    {
        $venueCost = 0;
        $equipmentCost = 0;

        // Calculate venue cost
        if ($booking->venue->hourly_rate) {
            $hours = $booking->duration_in_hours;
            $venueCost = $booking->venue->hourly_rate * $hours;
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

        foreach ($admins as $admin) {
            // Send email notification
            Mail::to($admin->email)->send(new BookingRequestReceived($booking));

            Notification::create([
                'type' => $type,
                'notifiable_type' => User::class,
                'notifiable_id' => $admin->id,
                'data' => [
                    'message' => "New booking request for {$booking->event_name} at {$booking->venue->name}",
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
                'message' => "Your booking for {$booking->event_name} has been " . str_replace('booking_', '', $type),
                'booking_id' => $booking->id,
            ],
        ]);
    }
}
