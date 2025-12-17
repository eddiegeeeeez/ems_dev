<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use Carbon\Carbon;

class RejectExpiredPendingBookings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookings:reject-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically reject pending booking requests that have passed their event date';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for expired pending bookings...');

        // Find all pending bookings where the start_datetime has passed
        $expiredBookings = Booking::where('status', 'pending')
            ->where('start_datetime', '<', Carbon::now())
            ->get();

        if ($expiredBookings->isEmpty()) {
            $this->info('No expired pending bookings found.');
            return 0;
        }

        $count = 0;
        foreach ($expiredBookings as $booking) {
            $booking->update([
                'status' => 'rejected',
                'rejection_reason' => 'Booking request expired. The event date has passed without approval.'
            ]);
            $count++;
            
            $this->line("Rejected booking #{$booking->id} - {$booking->event_title} (Event date: {$booking->start_datetime})");
        }

        $this->info("Successfully rejected {$count} expired pending booking(s).");
        return 0;
    }
}
