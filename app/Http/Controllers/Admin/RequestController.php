<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RequestController extends Controller
{
    public function __construct(private BookingService $bookingService) {}

    /**
     * Display a listing of booking requests.
     */
    public function index(): JsonResponse
    {
        try {
            $bookings = Booking::with('user', 'venue')
                ->latest()
                ->paginate(15);

            $stats = [
                'pending' => Booking::where('status', 'pending')->count(),
                'approved' => Booking::where('status', 'approved')->count(),
                'rejected' => Booking::where('status', 'rejected')->count(),
                'completed' => Booking::where('status', 'completed')->count(),
            ];

            return response()->json([
                'bookings' => $bookings,
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch booking requests'], 500);
        }
    }

    /**
     * Display the specified booking request.
     */
    public function show(Booking $booking): JsonResponse
    {
        try {
            $booking->load('user', 'venue', 'equipment.equipment');
            return response()->json(['booking' => $booking]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch booking details'], 500);
        }
    }

    /**
     * Approve a booking request.
     */
    public function approve(Booking $booking): JsonResponse
    {
        try {
            $this->bookingService->approveBooking($booking, request('notes'));
            return response()->json(['message' => 'Booking approved successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to approve booking'], 500);
        }
    }

    /**
     * Reject a booking request.
     */
    public function reject(Booking $booking): JsonResponse
    {
        try {
            request()->validate(['reason' => 'required|string|max:500']);
            $this->bookingService->rejectBooking($booking, request('reason'));
            return response()->json(['message' => 'Booking rejected successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to reject booking'], 500);
        }
    }
}
