<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceRequest;
use App\Models\Venue;
use App\Services\MaintenanceService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MaintenanceController extends Controller
{
    public function __construct(private MaintenanceService $maintenanceService) {}

    /**
     * Display maintenance requests.
     */
    public function requests(): JsonResponse
    {
        try {
            $requests = MaintenanceRequest::with('venue', 'assignedTo')
                ->latest()
                ->paginate(15);

            $stats = [
                'total' => MaintenanceRequest::count(),
                'pending' => MaintenanceRequest::where('status', 'pending')->count(),
                'in_progress' => MaintenanceRequest::where('status', 'in-progress')->count(),
                'completed' => MaintenanceRequest::where('status', 'completed')->count(),
            ];

            return response()->json([
                'requests' => $requests,
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch maintenance requests'], 500);
        }
    }

    /**
     * Display scheduled maintenance.
     */
    public function scheduled(): JsonResponse
    {
        try {
            $maintenance = MaintenanceRequest::where('type', 'preventive')
                ->with('venue', 'assignedTo')
                ->latest()
                ->paginate(15);

            return response()->json(['maintenance' => $maintenance]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch scheduled maintenance'], 500);
        }
    }

    /**
     * Store scheduled maintenance.
     */
    public function storeScheduled(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'venue_id' => 'required|exists:venues,id',
                'date' => 'required|date|after:today',
                'description' => 'required|string',
                'type' => 'required|in:routine,preventive,emergency',
                'priority' => 'required|in:low,medium,high',
            ]);

            $maintenance = $this->maintenanceService->createRequest($validated);
            return response()->json([
                'message' => 'Maintenance scheduled successfully',
                'maintenance' => $maintenance
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to schedule maintenance'], 500);
        }
    }

    /**
     * Assign maintenance request to technician.
     */
    public function assign(Request $request, MaintenanceRequest $maintenance): JsonResponse
    {
        try {
            $validated = $request->validate([
                'assigned_to_user_id' => 'required|exists:users,id',
            ]);

            $this->maintenanceService->assignRequest($maintenance, $validated['assigned_to_user_id']);
            return response()->json(['message' => 'Maintenance request assigned successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to assign maintenance request'], 500);
        }
    }

    /**
     * Update maintenance request status.
     */
    public function updateRequestStatus(Request $request, MaintenanceRequest $maintenance): JsonResponse
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:pending,in-progress,completed',
                'notes' => 'nullable|string|max:500',
            ]);

            $this->maintenanceService->updateStatus($maintenance, $validated['status'], $validated['notes'] ?? null);
            return response()->json(['message' => 'Maintenance request status updated']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update maintenance status'], 500);
        }
    }

    /**
     * Delete maintenance request.
     */
    public function destroy(MaintenanceRequest $maintenance): JsonResponse
    {
        try {
            $maintenance->delete();
            return response()->json(['message' => 'Maintenance request deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete maintenance request'], 500);
        }
    }
}
