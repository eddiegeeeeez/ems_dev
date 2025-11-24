<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceRequest;
use App\Models\Venue;
use App\Services\MaintenanceService;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class MaintenanceController extends Controller
{
    public function __construct(private MaintenanceService $maintenanceService) {}

    /**
     * Display maintenance requests.
     */
    public function requests(): View
    {
        $requests = MaintenanceRequest::with('venue', 'assignedTo')
            ->latest()
            ->paginate(15);

        $stats = [
            'total' => MaintenanceRequest::count(),
            'pending' => MaintenanceRequest::where('status', 'pending')->count(),
            'in_progress' => MaintenanceRequest::where('status', 'in-progress')->count(),
            'completed' => MaintenanceRequest::where('status', 'completed')->count(),
        ];

        return view('admin.maintenance.requests', compact('requests', 'stats'));
    }

    /**
     * Display scheduled maintenance.
     */
    public function scheduled(): View
    {
        $maintenance = MaintenanceRequest::where('type', 'preventive')
            ->with('venue', 'assignedTo')
            ->latest()
            ->paginate(15);

        return view('admin.maintenance.scheduled', compact('maintenance'));
    }

    /**
     * Show form for creating maintenance request.
     */
    public function create(): View
    {
        $venues = Venue::all();
        return view('admin.maintenance.create', compact('venues'));
    }

    /**
     * Store scheduled maintenance.
     */
    public function storeScheduled(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'venue_id' => 'required|exists:venues,id',
            'date' => 'required|date|after:today',
            'description' => 'required|string',
            'type' => 'required|in:routine,preventive,emergency',
            'priority' => 'required|in:low,medium,high',
        ]);

        $this->maintenanceService->createRequest($validated);
        return redirect()->route('admin.maintenance.requests')->with('success', 'Maintenance scheduled successfully.');
    }

    /**
     * Assign maintenance request to technician.
     */
    public function assign(Request $request, MaintenanceRequest $maintenance): RedirectResponse
    {
        $validated = $request->validate([
            'assigned_to_user_id' => 'required|exists:users,id',
        ]);

        $this->maintenanceService->assignRequest($maintenance, $validated['assigned_to_user_id']);
        return back()->with('success', 'Maintenance request assigned successfully.');
    }

    /**
     * Update maintenance request status.
     */
    public function updateRequestStatus(Request $request, MaintenanceRequest $maintenance): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in-progress,completed',
            'notes' => 'nullable|string|max:500',
        ]);

        $this->maintenanceService->updateStatus($maintenance, $validated['status'], $validated['notes'] ?? null);
        return back()->with('success', 'Maintenance request status updated.');
    }

    /**
     * Delete maintenance request.
     */
    public function destroy(MaintenanceRequest $maintenance): RedirectResponse
    {
        $maintenance->delete();
        return redirect()->route('admin.maintenance.requests')->with('success', 'Maintenance request deleted.');
    }
}
