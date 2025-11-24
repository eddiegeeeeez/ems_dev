<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use App\Models\Department;
use App\Services\VenueService;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class VenueController extends Controller
{
    public function __construct(private VenueService $venueService) {}

    /**
     * Display a listing of venues.
     */
    public function index(): View
    {
        $venues = Venue::with('department')
            ->withCount('bookings', 'equipment')
            ->paginate(15);

        $stats = [
            'total' => Venue::count(),
            'active' => Venue::where('is_active', true)->count(),
            'inactive' => Venue::where('is_active', false)->count(),
        ];

        return view('admin.venues.index', compact('venues', 'stats'));
    }

    /**
     * Show the form for creating a new venue.
     */
    public function create(): View
    {
        $departments = Department::all();
        return view('admin.venues.create', compact('departments'));
    }

    /**
     * Store a newly created venue in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'department_id' => 'required|exists:departments,id',
            'capacity' => 'required|integer|min:1',
            'hourly_rate' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'amenities' => 'nullable|array',
        ]);

        Venue::create($validated);
        return redirect()->route('admin.venues.index')->with('success', 'Venue created successfully');
    }

    /**
     * Display the specified venue.
     */
    public function show(Venue $venue): View
    {
        $venue->load('department', 'equipment', 'bookings');
        $stats = [
            'total_bookings' => $venue->bookings()->count(),
            'pending_bookings' => $venue->bookings()->where('status', 'pending')->count(),
            'equipment_count' => $venue->equipment()->count(),
            'total_revenue' => $venue->bookings()->where('status', 'completed')->sum('total_cost'),
        ];
        return view('admin.venues.show', compact('venue', 'stats'));
    }

    /**
     * Show the form for editing the specified venue.
     */
    public function edit(Venue $venue): View
    {
        $departments = Department::all();
        return view('admin.venues.edit', compact('venue', 'departments'));
    }

    /**
     * Update the specified venue in storage.
     */
    public function update(Request $request, Venue $venue): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'department_id' => 'required|exists:departments,id',
            'capacity' => 'required|integer|min:1',
            'hourly_rate' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'amenities' => 'nullable|array',
        ]);

        $venue->update($validated);
        return redirect()->route('admin.venues.show', $venue)->with('success', 'Venue updated successfully');
    }

    /**
     * Toggle venue active status.
     */
    public function toggleActive(Venue $venue): RedirectResponse
    {
        $venue->update(['is_active' => !$venue->is_active]);
        $status = $venue->is_active ? 'activated' : 'deactivated';
        return back()->with('success', "Venue {$status} successfully");
    }

    /**
     * Delete the specified venue.
     */
    public function destroy(Venue $venue): RedirectResponse
    {
        $venue->delete();
        return redirect()->route('admin.venues.index')->with('success', 'Venue deleted successfully');
    }
}
