<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\BookingEquipment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    /**
     * Display a listing of user's bookings - Returns JSON
     */
    public function index(): JsonResponse
    {
        try {
            $user = Auth::user();
            $bookings = Booking::with(['venue', 'user', 'bookingEquipment.equipment'])
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($booking) {
                    return [
                        'id' => (string) $booking->id,
                        'organizerId' => (string) $booking->user_id,
                        'venueId' => (string) $booking->venue_id,
                        'eventTitle' => $booking->event_title,
                        'eventDescription' => $booking->event_description,
                        'startDate' => $booking->start_date,
                        'endDate' => $booking->end_date,
                        'startTime' => $booking->start_time,
                        'endTime' => $booking->end_time,
                        'expectedAttendees' => $booking->expected_attendees,
                        'equipment' => $booking->bookingEquipment->map(fn($be) => [
                            'equipmentId' => (string) $be->equipment_id,
                            'quantity' => $be->quantity
                        ]),
                        'documents' => $booking->documents ?? [],
                        'status' => $booking->status,
                        'createdAt' => $booking->created_at->toISOString(),
                        'updatedAt' => $booking->updated_at->toISOString(),
                        'adminNotes' => $booking->admin_notes,
                        'venue' => [
                            'name' => $booking->venue->name,
                            'location' => $booking->venue->location,
                        ],
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $bookings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch bookings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new booking - Returns JSON
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'venueId' => 'required|exists:venues,id',
                'eventTitle' => 'required|string|max:255',
                'eventDescription' => 'required|string',
                'startDate' => 'required|date',
                'endDate' => 'required|date|after_or_equal:startDate',
                'startTime' => 'required',
                'endTime' => 'required',
                'expectedAttendees' => 'required|integer|min:1',
                'equipment' => 'array',
                'equipment.*.equipmentId' => 'required|exists:equipment,id',
                'equipment.*.quantity' => 'required|integer|min:1',
            ]);

            DB::beginTransaction();

            $booking = Booking::create([
                'user_id' => Auth::id(),
                'venue_id' => $validated['venueId'],
                'event_title' => $validated['eventTitle'],
                'event_description' => $validated['eventDescription'],
                'start_date' => $validated['startDate'],
                'end_date' => $validated['endDate'],
                'start_time' => $validated['startTime'],
                'end_time' => $validated['endTime'],
                'expected_attendees' => $validated['expectedAttendees'],
                'status' => 'pending',
            ]);

            // Add equipment
            if (isset($validated['equipment'])) {
                foreach ($validated['equipment'] as $equip) {
                    BookingEquipment::create([
                        'booking_id' => $booking->id,
                        'equipment_id' => $equip['equipmentId'],
                        'quantity' => $equip['quantity'],
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully',
                'data' => $booking->load('venue', 'bookingEquipment.equipment')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single booking details
     */
    public function show($id): JsonResponse
    {
        try {
            $booking = Booking::with(['venue', 'user', 'bookingEquipment.equipment'])
                ->findOrFail($id);

            // Check if user owns this booking or is admin
            if ($booking->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $booking
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }
    }

    /**
     * Update booking
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $booking = Booking::findOrFail($id);

            // Check ownership
            if ($booking->user_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Can only update pending bookings
            if ($booking->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Can only update pending bookings'
                ], 400);
            }

            $validated = $request->validate([
                'eventTitle' => 'string|max:255',
                'eventDescription' => 'string',
                'expectedAttendees' => 'integer|min:1',
            ]);

            $booking->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Booking updated successfully',
                'data' => $booking
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel booking
     */
    public function destroy($id): JsonResponse
    {
        try {
            $booking = Booking::findOrFail($id);

            // Check ownership
            if ($booking->user_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $booking->update(['status' => 'cancelled']);

            return response()->json([
                'success' => true,
                'message' => 'Booking cancelled successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel booking'
            ], 500);
        }
    }
}