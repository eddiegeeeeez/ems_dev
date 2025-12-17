<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VenueController extends Controller
{
    /**
     * Display a listing of venues - Returns JSON
     */
    public function index(): JsonResponse
    {
        try {
            $venues = Venue::with('college')
                ->where('is_active', true)
                ->get()
                ->map(function ($venue) {
                    return [
                        'id' => (string) $venue->id,
                        'name' => $venue->name,
                        'capacity' => $venue->capacity,
                        'location' => $venue->location,
                        'image' => $venue->image_url ?? '/modern-collaboration-room-with-tables-and-chairs.jpg',
                        'description' => $venue->description ?? '',
                        'status' => $venue->is_active ? 'available' : 'inactive',
                        'amenities' => $venue->amenities ?? [],
                        
                        'department' => $venue->college ? $venue->college->name : null, // Mapped for backward compatibility
                        'college' => $venue->college ? $venue->college->name : null,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $venues
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch venues',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single venue details - Returns JSON
     */
    public function show($id): JsonResponse
    {
        try {
            $venue = Venue::with(['college', 'equipment'])->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => (string) $venue->id,
                    'name' => $venue->name,
                    'capacity' => $venue->capacity,
                    'location' => $venue->location,
                    'image' => $venue->image_url ?? '/modern-collaboration-room-with-tables-and-chairs.jpg',
                    'description' => $venue->description ?? '',
                    'status' => $venue->is_active ? 'available' : 'inactive',
                    'amenities' => $venue->amenities ?? [],
                    
                    'openingHours' => $venue->opening_hours ?? [],
                    'department' => $venue->college ? $venue->college->name : null, // Compat
                    'college' => $venue->college ? $venue->college->name : null,
                    'equipment' => $venue->equipment ?? [],
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Venue not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}