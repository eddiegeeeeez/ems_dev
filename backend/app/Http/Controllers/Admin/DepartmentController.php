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

            // Transform the response to match frontend expectations
            $transformed = $departments->map(function ($dept) {
                return [
                    'id' => $dept->id,
                    'name' => $dept->name,
                    'code' => $dept->code,
                    'description' => $dept->description,
                    'college' => $dept->description ?? 'General',
                    'headOfDepartment' => 'Unassigned',
                    'email' => 'dept@ems.edu',
                    'totalMembers' => $dept->users_count ?? 0,
                    'activeEvents' => $dept->venues_count ?? 0,
                    'is_active' => $dept->is_active,
                    'created_at' => $dept->created_at,
                    'updated_at' => $dept->updated_at,
                ];
            });

            return response()->json([
                'departments' => new \Illuminate\Pagination\Paginator(
                    $transformed,
                    $departments->perPage(),
                    $departments->currentPage(),
                    ['path' => request()->url(), 'query' => request()->query()]
                )
            ]);
        } catch (\Exception $e) {
            \Log::error('Departments error: ' . $e->getMessage());
            return response()->json(['departments' => []]);
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
