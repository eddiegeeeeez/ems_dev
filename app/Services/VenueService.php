<?php

namespace App\Services;

use App\Models\Venue;
use Carbon\Carbon;

class VenueService
{
    /**
     * Get available venues for a date range
     */
    public function getAvailableVenues(Carbon $startDate, Carbon $endDate, int $minCapacity = null)
    {
        $query = Venue::where('is_active', true)
            ->whereDoesntHave('bookings', function ($q) use ($startDate, $endDate) {
                $q->where('status', 'approved')
                    ->where(function ($query) use ($startDate, $endDate) {
                        $query->whereBetween('start_datetime', [$startDate, $endDate])
                            ->orWhereBetween('end_datetime', [$startDate, $endDate])
                            ->orWhere([
                                ['start_datetime', '<=', $startDate],
                                ['end_datetime', '>=', $endDate],
                            ]);
                    });
            });

        if ($minCapacity) {
            $query->where('capacity', '>=', $minCapacity);
        }

        return $query->with('department')->get();
    }

    /**
     * Get venue statistics
     */
    public function getVenueStats(Venue $venue)
    {
        $totalBookings = $venue->bookings()->count();
        $approvedBookings = $venue->bookings()->where('status', 'approved')->count();
        $totalRevenue = $venue->bookings()
            ->where('status', 'approved')
            ->sum('total_cost');

        $utilizationRate = $totalBookings > 0
            ? round(($approvedBookings / $totalBookings) * 100, 2)
            : 0;

        return [
            'total_bookings' => $totalBookings,
            'approved_bookings' => $approvedBookings,
            'total_revenue' => $totalRevenue,
            'utilization_rate' => $utilizationRate,
        ];
    }

    /**
     * Get booking calendar for venue
     */
    public function getVenueCalendar(Venue $venue, Carbon $month)
    {
        return $venue->bookings()
            ->where('status', 'approved')
            ->whereBetween('start_datetime', [
                $month->copy()->startOfMonth(),
                $month->copy()->endOfMonth(),
            ])
            ->get()
            ->groupBy(function ($booking) {
                return $booking->start_datetime->format('Y-m-d');
            });
    }

    /**
     * Check if venue is available for slot
     */
    public function isVenueAvailable(Venue $venue, Carbon $startDate, Carbon $endDate): bool
    {
        return !$venue->bookings()
            ->where('status', 'approved')
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_datetime', [$startDate, $endDate])
                    ->orWhereBetween('end_datetime', [$startDate, $endDate])
                    ->orWhere([
                        ['start_datetime', '<=', $startDate],
                        ['end_datetime', '>=', $endDate],
                    ]);
            })
            ->exists();
    }
}
