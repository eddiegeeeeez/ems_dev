<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CollegeController extends Controller
{
    /**
     * Display a listing of colleges with their programs.
     */
    public function index(): JsonResponse
    {
        try {
            $colleges = College::with('programs')
                ->withCount('programs')
                ->latest()
                ->get();

            return response()->json([
                'colleges' => $colleges
            ]);
        } catch (\Exception $e) {
            \Log::error('Colleges error: ' . $e->getMessage());
            return response()->json(['colleges' => []]);
        }
    }

    /**
     * Display the specified college with programs.
     */
    public function show(College $college): JsonResponse
    {
        try {
            $college->load('programs');
            return response()->json(['college' => $college]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch college details'], 500);
        }
    }

    /**
     * Store a newly created college.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:colleges',
                'code' => 'required|string|max:20|unique:colleges',
                'dean' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $college = College::create($validated);
            return response()->json([
                'message' => 'College created successfully',
                'college' => $college
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create college'], 500);
        }
    }

    /**
     * Update the specified college.
     */
    public function update(Request $request, College $college): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:20',
                'dean' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $college->update($validated);
            return response()->json([
                'message' => 'College updated successfully',
                'college' => $college
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update college'], 500);
        }
    }

    /**
     * Delete the specified college.
     */
    public function destroy(College $college): JsonResponse
    {
        try {
            $college->delete();
            return response()->json(['message' => 'College deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete college'], 500);
        }
    }

    /**
     * Get programs for a specific college.
     */
    public function programs(College $college): JsonResponse
    {
        try {
            $programs = $college->programs;
            return response()->json(['programs' => $programs]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch programs'], 500);
        }
    }
}
