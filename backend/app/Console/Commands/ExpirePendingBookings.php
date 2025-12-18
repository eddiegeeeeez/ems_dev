<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use App\Services\BookingService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ExpirePendingBookings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'booking:expire-pending';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reject pending bookings that have passed their start date';

    /**
     * Execute the console command.
     */
    public function handle(BookingService $bookingService)
    {
        $now = Carbon::now();
        $this->info("Checking for pending bookings strictly older than: " . $now->toDateTimeString());

        $expiredBookings = Booking::where('status', 'pending')
            ->where('start_datetime', '<', $now)
            ->get();

        $count = $expiredBookings->count();

        if ($count === 0) {
            $this->info('No expired pending bookings found.');
            return;
        }

        $this->info("Found {$count} expired pending bookings. Processing...");

        foreach ($expiredBookings as $booking) {
            try {
                $this->info("Rejecting booking ID: {$booking->id} (Start: {$booking->start_datetime})");
                
                // Use service to handle notification and logging
                $bookingService->rejectBooking(
                    $booking, 
                    'System Auto-Rejection: The booking request was not approved before the event start time.'
                );
                
            } catch (\Exception $e) {
                $this->error("Failed to reject booking ID {$booking->id}: " . $e->getMessage());
                Log::error("Auto-reject failed for booking {$booking->id}", ['error' => $e->getMessage()]);
            }
        }

        $this->info('Completed processing expired bookings.');
    }
}
