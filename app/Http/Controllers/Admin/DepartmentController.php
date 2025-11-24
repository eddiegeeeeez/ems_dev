<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DepartmentController extends Controller
{
    /**
     * Display a listing of departments.
     */
    public function index(): JsonResponse
    {
        try {
            $departments = Department::withCount('users', 'venues')
                ->latest()
                ->paginate(15);

            return response()->json(['departments' => $departments]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch departments'], 500);
        }
    }

    /**
     * Display the specified department.
     */
    public function show(Department $department): JsonResponse
    {
        try {
            $department->load('users', 'venues');
            return response()->json(['department' => $department]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch department details'], 500);
        }
    }

    /**
     * Store a newly created department.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:departments',
                'description' => 'nullable|string',
            ]);

            $department = Department::create($validated);
            return response()->json([
                'message' => 'Department created successfully',
                'department' => $department
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create department'], 500);
        }
    }

    /**
     * Update the specified department.
     */
    public function update(Request $request, Department $department): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $department->update($validated);
            return response()->json([
                'message' => 'Department updated successfully',
                'department' => $department
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update department'], 500);
        }
    }

    /**
     * Delete the specified department.
     */
    public function destroy(Department $department): JsonResponse
    {
        try {
            $department->delete();
            return response()->json(['message' => 'Department deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete department'], 500);
        }
    }
}
