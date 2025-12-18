<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\BookingEquipment;
use App\Models\Venue;
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
            if ($user->isAdmin()) {
                $bookings = Booking::with(['venue', 'user', 'equipment.equipment'])
                    ->orderBy('created_at', 'desc')
                    ->get();
            } elseif ($user->isOrganizer()) {
                // Organizers can only see their own bookings
                $bookings = Booking::with(['venue', 'user', 'equipment.equipment'])
                    ->where('user_id', $user->id)
                    ->orderBy('created_at', 'desc')
                    ->get();
            } else {
                $bookings = Booking::with(['venue', 'user', 'equipment.equipment'])
                    ->where('user_id', $user->id)
                    ->orderBy('created_at', 'desc')
                    ->get();
            }
                
            $bookings = $bookings->map(function ($booking) {
                    return [
                        'id' => (string) $booking->id,
                        'organizerId' => (string) $booking->user_id,
                        'venueId' => (string) $booking->venue_id,
                        'eventTitle' => $booking->event_title,
                        'eventDescription' => $booking->event_description ?? '',
                        'startDate' => $booking->start_datetime ? $booking->start_datetime->format('Y-m-d') : '',
                        'endDate' => $booking->end_datetime ? $booking->end_datetime->format('Y-m-d') : '',
                        'startTime' => $booking->start_datetime ? $booking->start_datetime->format('H:i') : '',
                        'endTime' => $booking->end_datetime ? $booking->end_datetime->format('H:i') : '',
                        'expectedAttendees' => (int) ($booking->expected_attendees ?? 0),
                        'qrCode' => $booking->qr_code ?? '',
                        'equipment' => $booking->equipment->map(fn($be) => [
                            'equipmentId' => (string) $be->equipment_id,
                            'quantity' => $be->quantity
                        ]),
                        'documents' => $booking->documents ?? [],
                        'status' => $booking->status,
                        'createdAt' => $booking->created_at->toISOString(),
                        'updatedAt' => $booking->updated_at->toISOString(),
                        'adminNotes' => $booking->notes,
                        'rejectionReason' => $booking->rejection_reason ?? '',
                        'venue' => [
                            'name' => $booking->venue->name,
                            'location' => $booking->venue->location,
                        ],
                        'user' => [
                            'id' => (string) $booking->user->id,
                            'name' => $booking->user->name,
                            'email' => $booking->user->email,
                            'department' => $booking->user->department,
                            'college' => $booking->user->college,
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
    public function store(\App\Http\Requests\StoreBookingRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            
            // Create the booking
            if (!Auth::user()->isOrganizer() && !Auth::user()->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only organizers can create bookings'
                ], 403);
            }

            $booking = Booking::create([
                'user_id' => Auth::id(),
                'venue_id' => $validated['venue_id'],
                'event_title' => $validated['event_title'],
                'event_description' => $validated['event_description'] ?? null,
                'start_datetime' => $validated['start_datetime'],
                'end_datetime' => $validated['end_datetime'],
                'expected_attendees' => $validated['expected_attendees'],
                'expected_attendees' => $validated['expected_attendees'],
                'status' => 'pending',
                'documents' => [],
            ]);

            // Handle file upload
            if ($request->hasFile('documents')) {
                $documents = [];
                foreach ($request->file('documents') as $file) {
                    $path = $file->store('documents', 'public');
                    $documents[] = [
                        'name' => $file->getClientOriginalName(),
                        'url' => \Illuminate\Support\Facades\Storage::url($path),
                        'path' => $path
                    ];
                }
                $booking->update(['documents' => $documents]);
            }

            // Attach equipment if provided
            if (!empty($validated['equipment'])) {
                foreach ($validated['equipment'] as $item) {
                    BookingEquipment::create([
                        'booking_id' => $booking->id,
                        'equipment_id' => $item['equipment_id'],
                        'quantity_requested' => $item['quantity'],
                    ]);
                }
            }

            // Log booking creation
            \App\Services\AuditService::log(
                'booking_created', 
                'Booking', 
                $booking->id, 
                null, 
                $booking->toArray(), 
                "New booking created: {$booking->event_title}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Booking request submitted successfully',
                'data' => $booking->load('equipment', 'venue')
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Failed to create booking', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create booking',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
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

            $oldValues = $booking->only(array_keys($validated));
            $booking->update($validated);

            // Log booking update
            \App\Services\AuditService::log(
                'booking_updated',
                'Booking',
                $booking->id,
                $oldValues,
                $validated,
                "Booking updated: {$booking->event_title}"
            );

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

            // Log cancellation
            \App\Services\AuditService::log(
                'booking_cancelled', 
                'Booking', 
                $booking->id, 
                ['status' => 'pending'], 
                ['status' => 'cancelled'], 
                "Booking cancelled: {$booking->event_title}"
            );

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