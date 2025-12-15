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
            $equipment = Equipment::with('venue')
                ->latest()
                ->paginate(15);

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
            return response()->json(['error' => 'Failed to fetch equipment'], 500);
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
                'venue_id' => 'required|exists:venues,id',
                'category' => 'nullable|string|max:100',
            ]);

            $equipment = Equipment::create($validated);
            return response()->json([
                'message' => 'Equipment added successfully',
                'equipment' => $equipment->load('venue')
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create equipment'], 500);
        }
    }

    /**
     * Display the specified equipment.
     */
    public function show(Equipment $equipment): JsonResponse
    {
        try {
            $equipment->load('venue');
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
                'venue_id' => 'required|exists:venues,id',
                'category' => 'nullable|string|max:100',
            ]);

            $equipment->update($validated);
            return response()->json([
                'message' => 'Equipment updated successfully',
                'equipment' => $equipment->load('venue')
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
