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
    public function index(Request $request): JsonResponse
    {
        try {
            $status = $request->query('status', 'pending');
            $bookings = Booking::with('user', 'venue', 'equipment.equipment')
                ->where('status', $status)
                ->latest()
                ->paginate(10);

            $transformedBookings = $bookings->getCollection()->map(function ($booking) {
                    return [
                        'id' => $booking->id,
                        'organizerId' => $booking->user_id,
                        'venueId' => $booking->venue_id,
                        'eventTitle' => $booking->event_title,
                        'eventDescription' => $booking->event_description,
                        'startDate' => $booking->start_datetime ? $booking->start_datetime->format('Y-m-d') : null,
                        'endDate' => $booking->end_datetime ? $booking->end_datetime->format('Y-m-d') : null,
                        'startTime' => $booking->start_datetime ? $booking->start_datetime->format('H:i') : null,
                        'endTime' => $booking->end_datetime ? $booking->end_datetime->format('H:i') : null,
                        'expectedAttendees' => $booking->expected_attendees,
                        'status' => $booking->status,
                        'rejectionReason' => $booking->rejection_reason,
                        'adminNotes' => $booking->notes,
                        'qrCode' => $booking->qr_code,
                        'createdAt' => $booking->created_at->toISOString(),
                        'updatedAt' => $booking->updated_at->toISOString(),
                        'venue' => $booking->venue ? [
                            'id' => $booking->venue->id,
                            'name' => $booking->venue->name,
                            'location' => $booking->venue->location,
                            'capacity' => $booking->venue->capacity,
                        ] : null,
                        'user' => $booking->user ? [
                            'id' => $booking->user->id,
                            'name' => $booking->user->name,
                            'email' => $booking->user->email,
                            'role' => $booking->user->role,
                            'department' => $booking->user->department,
                            'college' => $booking->user->college,
                        ] : null,
                        'equipment' => $booking->equipment->map(function ($eq) {
                            return [
                                'equipmentId' => $eq->equipment_id,
                                'quantity' => $eq->quantity_requested,
                                'equipment' => $eq->equipment ? [
                                    'id' => $eq->equipment->id,
                                    'name' => $eq->equipment->name,
                                ] : null,
                            ];
                        }),
                        'documents' => $booking->documents ?? [],
                    ];
                });

            $bookings->setCollection($transformedBookings);

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
            \Log::error('Failed to fetch booking requests', ['error' => $e->getMessage()]);
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
     * Approve a booking request
     */
    public function approve(Request $request, $id)
    {
        try {
            \Log::info('Approving booking', ['booking_id' => $id]);
            
            $booking = Booking::with('user')->findOrFail($id);
            
            $notes = $request->input('notes');
            
            $result = $this->bookingService->approveBooking($booking, $notes);
            
            \Log::info('Booking approved successfully', ['booking_id' => $id]);
            
            return response()->json([
                'success' => true,
                'message' => 'Booking approved successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to approve booking', [
                'booking_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve booking: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject a booking request
     */
    public function reject(Request $request, $id)
    {
        try {
            \Log::info('Rejecting booking', ['booking_id' => $id]);
            
            $booking = Booking::with('user')->findOrFail($id);
            
            $reason = $request->input('reason', 'No reason provided');
            
            $result = $this->bookingService->rejectBooking($booking, $reason);
            
            \Log::info('Booking rejected successfully', ['booking_id' => $id]);
            
            return response()->json([
                'success' => true,
                'message' => 'Booking rejected successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to reject booking', [
                'booking_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject booking: ' . $e->getMessage()
            ], 500);
        }
    }
}
