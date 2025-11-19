<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    /**
     * Display a listing of equipment.
     */
    public function index()
    {
        return view('admin.equipment');
    }

    /**
     * Store a newly created equipment.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'venue_id' => 'required|exists:venues,id',
        ]);

        return back()->with('success', 'Equipment added successfully.');
    }

    /**
     * Update the specified equipment.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'quantity' => 'required|integer|min:1',
        ]);

        return back()->with('success', 'Equipment updated successfully.');
    }

    /**
     * Delete the specified equipment.
     */
    public function destroy($id)
    {
        return back()->with('success', 'Equipment deleted successfully.');
    }
}
