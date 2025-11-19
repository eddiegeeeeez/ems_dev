<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class RequestController extends Controller
{
    /**
     * Display a listing of pending booking requests.
     */
    public function index()
    {
        $bookings = Booking::where('status', 'pending')
            ->with('user', 'venue')
            ->latest()
            ->paginate(10);

        return view('admin.requests', compact('bookings'));
    }

    /**
     * Display the specified booking request.
     */
    public function show($id)
    {
        $booking = Booking::with('user', 'venue')->findOrFail($id);
        return view('admin.requests.show', compact('booking'));
    }

    /**
     * Approve a booking request.
     */
    public function approve($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->update(['status' => 'approved']);

        return back()->with('success', 'Booking request approved successfully.');
    }

    /**
     * Reject a booking request.
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $booking = Booking::findOrFail($id);
        $booking->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
        ]);

        return back()->with('success', 'Booking request rejected successfully.');
    }
}
