<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MaintenanceController extends Controller
{
    /**
     * Display maintenance requests.
     */
    public function requests()
    {
        return view('admin.maintenance.requests');
    }

    /**
     * Update maintenance request status.
     */
    public function updateRequestStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in-progress,completed',
            'notes' => 'nullable|string',
        ]);

        return back()->with('success', 'Maintenance request status updated.');
    }

    /**
     * Display scheduled maintenance.
     */
    public function scheduled()
    {
        return view('admin.maintenance.scheduled');
    }

    /**
     * Store scheduled maintenance.
     */
    public function storeScheduled(Request $request)
    {
        $validated = $request->validate([
            'venue_id' => 'required|exists:venues,id',
            'date' => 'required|date',
            'description' => 'required|string',
            'type' => 'required|in:routine,preventive,emergency',
        ]);

        return back()->with('success', 'Maintenance scheduled successfully.');
    }
}
