<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CalendarController extends Controller
{
    /**
     * Display the calendar view.
     */
    public function index()
    {
        return view('admin.calendar');
    }

    /**
     * Get calendar events (for AJAX).
     */
    public function getEvents(Request $request)
    {
        $start = $request->query('start');
        $end = $request->query('end');

        // Get all approved bookings in the date range
        $bookings = Booking::where('status', 'approved')
            ->whereBetween('start_datetime', [
                Carbon::parse($start),
                Carbon::parse($end)
            ])
            ->with('venue', 'user')
            ->get();

        // Format events for FullCalendar
        $events = $bookings->map(function ($booking) {
            return [
                'id' => $booking->id,
                'title' => $booking->event_name . ' - ' . $booking->venue->name,
                'start' => $booking->start_datetime->toIso8601String(),
                'end' => $booking->end_datetime->toIso8601String(),
                'extendedProps' => [
                    'organizer' => $booking->user->name,
                    'venue' => $booking->venue->name,
                    'status' => $booking->status,
                ],
                'backgroundColor' => $this->getStatusColor($booking->status),
            ];
        })->toArray();

        return response()->json($events);
    }

    /**
     * Get event details.
     */
    public function eventDetails($id)
    {
        $booking = Booking::with('user', 'venue')->findOrFail($id);

        return response()->json([
            'id' => $booking->id,
            'title' => $booking->event_name,
            'organizer' => $booking->user->name,
            'venue' => $booking->venue->name,
            'start_datetime' => $booking->start_datetime,
            'end_datetime' => $booking->end_datetime,
            'status' => $booking->status,
            'expected_attendees' => $booking->expected_attendees,
        ]);
    }

    /**
     * Get color based on status.
     */
    private function getStatusColor($status)
    {
        return match($status) {
            'approved' => '#4caf50',
            'pending' => '#ff9800',
            'rejected' => '#f44336',
            'completed' => '#2196f3',
            'cancelled' => '#9e9e9e',
            default => '#666666',
        };
    }
}
