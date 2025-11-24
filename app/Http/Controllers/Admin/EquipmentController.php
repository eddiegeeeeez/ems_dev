<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class EquipmentController extends Controller
{
    /**
     * Display a listing of equipment.
     */
    public function index(): View
    {
        $equipment = Equipment::with('venue')
            ->latest()
            ->paginate(15);

        $stats = [
            'total' => Equipment::count(),
            'low_stock' => Equipment::where('quantity', '<', 5)->count(),
            'venues' => Venue::count(),
        ];

        return view('admin.equipment.index', compact('equipment', 'stats'));
    }

    /**
     * Show the form for creating new equipment.
     */
    public function create(): View
    {
        $venues = Venue::all();
        return view('admin.equipment.create', compact('venues'));
    }

    /**
     * Store a newly created equipment.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
            'venue_id' => 'required|exists:venues,id',
            'category' => 'nullable|string|max:100',
        ]);

        Equipment::create($validated);
        return redirect()->route('admin.equipment.index')->with('success', 'Equipment added successfully.');
    }

    /**
     * Display the specified equipment.
     */
    public function show(Equipment $equipment): View
    {
        $equipment->load('venue');
        return view('admin.equipment.show', compact('equipment'));
    }

    /**
     * Show the form for editing equipment.
     */
    public function edit(Equipment $equipment): View
    {
        $venues = Venue::all();
        return view('admin.equipment.edit', compact('equipment', 'venues'));
    }

    /**
     * Update the specified equipment.
     */
    public function update(Request $request, Equipment $equipment): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
            'venue_id' => 'required|exists:venues,id',
            'category' => 'nullable|string|max:100',
        ]);

        $equipment->update($validated);
        return redirect()->route('admin.equipment.show', $equipment)->with('success', 'Equipment updated successfully.');
    }

    /**
     * Delete the specified equipment.
     */
    public function destroy(Equipment $equipment): RedirectResponse
    {
        $equipment->delete();
        return redirect()->route('admin.equipment.index')->with('success', 'Equipment deleted successfully.');
    }
}
