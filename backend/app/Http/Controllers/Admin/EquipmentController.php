<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EquipmentController extends Controller
{
    /**
     * Display a listing of equipment.
     */
    public function index(): JsonResponse
    {
        try {
            $equipment = Equipment::with(['venue', 'college'])
                ->latest()
                ->get();

            $stats = [
                'total' => Equipment::count(),
                'low_stock' => Equipment::where('quantity', '<', 5)->count(),
                'venues' => Venue::count(),
            ];

            return response()->json([
                'equipment' => $equipment,
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            \Log::error('Equipment index error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch equipment: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Check equipment availability for a specific time range.
     */
    public function checkAvailability(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_datetime' => 'required|date',
                'end_datetime' => 'required|date|after:start_datetime',
            ]);

            $start = $validated['start_datetime'];
            $end = $validated['end_datetime'];

            // Get all equipment
            $equipmentList = Equipment::all();
            
            // Get bookings that overlap with the requested time
            // Overlap formula: (StartA < EndB) and (EndA > StartB)
            $overlappingBookings = \App\Models\Booking::where(function ($query) use ($start, $end) {
                    $query->where('start_datetime', '<', $end)
                          ->where('end_datetime', '>', $start);
                })
                ->whereIn('status', ['pending', 'approved']) // Only count pending and approved
                ->with('equipment')
                ->get();

            $reservedQuantities = [];

            foreach ($overlappingBookings as $booking) {
                foreach ($booking->equipment as $be) {
                    if (!isset($reservedQuantities[$be->equipment_id])) {
                        $reservedQuantities[$be->equipment_id] = 0;
                    }
                    $reservedQuantities[$be->equipment_id] += $be->quantity;
                }
            }

            // Calculate available quantity for each item
            $availability = $equipmentList->map(function ($item) use ($reservedQuantities) {
                $reserved = $reservedQuantities[$item->id] ?? 0;
                $available = max(0, $item->quantity - $reserved);
                
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'total_quantity' => $item->quantity,
                    'reserved_quantity' => $reserved,
                    'available_quantity' => $available,
                    'venue_id' => $item->venue_id, // Keep for frontend filtering
                    'category' => $item->category,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $availability
            ]);

        } catch (\Exception $e) {
             \Log::error('Availability check error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to check availability: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created equipment.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'quantity' => 'required|integer|min:1',
                'college_id' => 'required|exists:colleges,id',
                'venue_id' => 'nullable|exists:venues,id',
                'category' => 'nullable|string|max:100',
            ]);

            // Set available_quantity to match quantity on creation
            $validated['available_quantity'] = $validated['quantity'];

            $equipment = Equipment::create($validated);
            return response()->json([
                'message' => 'Equipment added successfully',
                'equipment' => $equipment->load(['venue', 'college'])
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create equipment: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified equipment.
     */
    public function show(Equipment $equipment): JsonResponse
    {
        try {
            $equipment->load(['venue', 'college']);
            return response()->json(['equipment' => $equipment]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch equipment details'], 500);
        }
    }

    /**
     * Update the specified equipment.
     */
    public function update(Request $request, Equipment $equipment): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'quantity' => 'required|integer|min:1',
                'college_id' => 'required|exists:colleges,id',
                'venue_id' => 'nullable|exists:venues,id',
                'category' => 'nullable|string|max:100',
            ]);

            $equipment->update($validated);
            return response()->json([
                'message' => 'Equipment updated successfully',
                'equipment' => $equipment->load(['venue', 'college'])
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update equipment'], 500);
        }
    }

    /**
     * Delete the specified equipment.
     */
    public function destroy(Equipment $equipment): JsonResponse
    {
        try {
            $equipment->delete();
            return response()->json(['message' => 'Equipment deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete equipment'], 500);
        }
    }
}
