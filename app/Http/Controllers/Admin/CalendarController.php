<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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

        // Return events in FullCalendar format
        $events = [];

        return response()->json($events);
    }

    /**
     * Get event details.
     */
    public function eventDetails($id)
    {
        $booking = \App\Models\Booking::with('user', 'venue')->findOrFail($id);

        return response()->json([
            'id' => $booking->id,
            'title' => $booking->venue->name,
            'organizer' => $booking->user->name,
            'date' => $booking->date,
            'time' => $booking->time,
            'status' => $booking->status,
        ]);
    }
}
