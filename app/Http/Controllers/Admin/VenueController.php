<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use App\Models\Department;
use App\Services\VenueService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class VenueController extends Controller
{
    public function __construct(private VenueService $venueService) {}

    /**
     * Display a listing of venues.
     */
    public function index(): JsonResponse
    {
        try {
            $venues = Venue::with('department')
                ->withCount('bookings', 'equipment')
                ->paginate(15);

            $stats = [
                'total' => Venue::count(),
                'active' => Venue::where('is_active', true)->count(),
                'inactive' => Venue::where('is_active', false)->count(),
            ];

            return response()->json([
                'venues' => $venues,
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch venues'], 500);
        }
    }

    /**
     * Store a newly created venue in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'department_id' => 'required|exists:departments,id',
                'capacity' => 'required|integer|min:1',
                'hourly_rate' => 'required|numeric|min:0',
                'is_active' => 'boolean',
                'amenities' => 'nullable|array',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            ]);

            // Handle image upload
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('venues', 'public');
                $validated['image_url'] = Storage::url($imagePath);
            }

            $venue = Venue::create($validated);
            return response()->json([
                'message' => 'Venue created successfully',
                'venue' => $venue->load('department')
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create venue'], 500);
        }
    }

    /**
     * Display the specified venue.
     */
    public function show(Venue $venue): JsonResponse
    {
        try {
            $venue->load('department', 'equipment', 'bookings');
            $stats = [
                'total_bookings' => $venue->bookings()->count(),
                'pending_bookings' => $venue->bookings()->where('status', 'pending')->count(),
                'equipment_count' => $venue->equipment()->count(),
                'total_revenue' => $venue->bookings()->where('status', 'completed')->sum('total_cost'),
            ];
            return response()->json([
                'venue' => $venue,
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch venue details'], 500);
        }
    }

    /**
     * Update the specified venue in storage.
     */
    public function update(Request $request, Venue $venue): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'department_id' => 'required|exists:departments,id',
                'capacity' => 'required|integer|min:1',
                'hourly_rate' => 'required|numeric|min:0',
                'is_active' => 'boolean',
                'amenities' => 'nullable|array',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            ]);

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if it exists
                if ($venue->image_url) {
                    $oldPath = str_replace('/storage/', '', $venue->image_url);
                    Storage::disk('public')->delete($oldPath);
                }
                
                $imagePath = $request->file('image')->store('venues', 'public');
                $validated['image_url'] = Storage::url($imagePath);
            }

            $venue->update($validated);
            return response()->json([
                'message' => 'Venue updated successfully',
                'venue' => $venue->load('department')
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update venue'], 500);
        }
    }

    /**
     * Toggle venue active status.
     */
    public function toggleActive(Venue $venue): JsonResponse
    {
        try {
            $venue->update(['is_active' => !$venue->is_active]);
            $status = $venue->is_active ? 'activated' : 'deactivated';
            return response()->json([
                'message' => "Venue {$status} successfully",
                'venue' => $venue
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to toggle venue status'], 500);
        }
    }

    /**
     * Delete the specified venue.
     */
    public function destroy(Venue $venue): JsonResponse
    {
        try {
            $venue->delete();
            return response()->json(['message' => 'Venue deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete venue'], 500);
        }
    }
}
