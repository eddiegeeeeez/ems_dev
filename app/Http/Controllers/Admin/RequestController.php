<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class RequestController extends Controller
{
    public function __construct(private BookingService $bookingService) {}

    /**
     * Display a listing of booking requests.
     */
    public function index(): View
    {
        $bookings = Booking::with('user', 'venue')
            ->latest()
            ->paginate(15);

        $stats = [
            'pending' => Booking::where('status', 'pending')->count(),
            'approved' => Booking::where('status', 'approved')->count(),
            'rejected' => Booking::where('status', 'rejected')->count(),
            'completed' => Booking::where('status', 'completed')->count(),
        ];

        return view('admin.requests.index', compact('bookings', 'stats'));
    }

    /**
     * Display the specified booking request.
     */
    public function show(Booking $booking): View
    {
        $booking->load('user', 'venue', 'equipment.equipment');
        return view('admin.requests.show', compact('booking'));
    }

    /**
     * Approve a booking request.
     */
    public function approve(Booking $booking): RedirectResponse
    {
        $this->bookingService->approveBooking($booking, request('notes'));
        return redirect()->route('admin.requests.index')->with('success', 'Booking approved successfully');
    }

    /**
     * Reject a booking request.
     */
    public function reject(Booking $booking): RedirectResponse
    {
        request()->validate(['reason' => 'required|string|max:500']);
        $this->bookingService->rejectBooking($booking, request('reason'));
        return redirect()->route('admin.requests.index')->with('success', 'Booking rejected successfully');
    }
}
